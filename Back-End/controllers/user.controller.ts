import { RegistrationRequest } from "../../Shared/models/models/registration-request.model";
import { UpdateNicknameRequest} from "../../Shared/models/models/update-nickname-request.model";
import { UpdatePasswordRequest} from "../../Shared/models/models/update-password-request.model";
import { UserData, DEFAULTPFP } from "../../Shared/models/models/user-data.model";
import { UserDataValidator } from "../../Shared/Validators/user-data.validator";
import { Token } from "../../Shared/models/models/token.model";
import { LoginRequest } from "../../Shared/models/models/login-request.model";
import { LoginRequestResponse } from "../../Shared/models/models/login-request-response.model";
import { IDatabaseAccessService } from "../services/database-access.interface";
import { JWTProvider } from "../services/jwt-provider.service";
import { TokenUserData } from "../models/token-user-data.model";

import * as path from "path";
import * as fsAsync from "fs/promises";
import * as fs from "fs";

import { Request, Response } from 'express';
import {UploadedFile} from "express-fileupload";
import { v4 as uuidv4 } from 'uuid'; 
import * as hasha from "hasha";

export class UserController{
    private assetsPath:string;

    constructor(private dbAccess:IDatabaseAccessService<UserData>, private jwtProvider:JWTProvider){
        this.assetsPath = "../Assets";
    }

    public async createUser(request:Request,response:Response){
        const registrationForm:RegistrationRequest = request.body;
        const user = new UserData(registrationForm.username, registrationForm.password);
        this.assignExcessData(registrationForm, user);

        // Check if there is a user with the same username
        let usersFromDB:UserData[] = undefined;
        try{
            usersFromDB = await this.dbAccess.retrieveEntriesByFilterAsync({username: user.username});
        }catch(error){
            request.log.error(error);
            return response.sendStatus(500);
        }

        if(!UserDataValidator.isValidNickname(user.nickname))
        {
            return response.status(400).send("Invalid Nickname!");
        }

        if(!UserDataValidator.isValidUsername(user.username))
        {
            return response.status(400).send("Invalid Username!");
        }

        //// As passwords are hashed on the client side as well I cannot properly validate the password here 
        //if(!UserDataValidator.isValidPassword(user.password)){
        //    return response.status(400).send("Password too weak!");
        //}
        
        if(usersFromDB.length === 0){
            try{
                user.password = hasha(user.password);
                const userFromDB = await this.dbAccess.createEntryAsync(user);
                const tokenUserData = new TokenUserData(userFromDB.username);
                const token = this.jwtProvider.getToken(tokenUserData);
                const refreshToken = await this.jwtProvider.getRefreshToken(tokenUserData);
    
                userFromDB.password = null;
                return response.status(200).send(new LoginRequestResponse(userFromDB, token, refreshToken));
            }catch(error){
                request.log.error(error);
                return response.sendStatus(500);
            }
        }else
            return response.status(409).send("Username is already taken!");
    }

    public async loginUser(request:Request,response:Response){
        const loginForm:LoginRequest = request.body;

        try{
            loginForm.password = hasha(loginForm.password);
        }catch(error){
            request.log.error(error);
            return response.status(400).send("Password cannot be empty null or consist only of whitespaces.");
        }

        let usersFromDB:UserData[] = undefined;
        try{
            usersFromDB = await this.dbAccess.retrieveEntriesByFilterAsync({username: loginForm.username, password: loginForm.password});
        }catch(error){
            request.log.error(error);
            return response.sendStatus(500);
        }

        if(usersFromDB.length !== 0){
            try{
                const userFromDB = usersFromDB[0];
                const tokenUserData = new TokenUserData(userFromDB.username);
                const token = this.jwtProvider.getToken(tokenUserData);
                const refreshToken = await this.jwtProvider.getRefreshToken(tokenUserData);

                userFromDB.password = null;
                return response.status(200).send(new LoginRequestResponse(userFromDB, token, refreshToken));
            }catch(error){
                request.log.error(error);
                return response.sendStatus(500);
            }
        }
        else
            return response.status(401).send("Access Denied!");
    }

    public async getProfilePic(request:Request,response:Response){
        const userData:UserData = JSON.parse(request.params.user);
        response.contentType(userData.profilePicture);
        response.status(200).sendFile(userData.profilePicture, {root: `${this.assetsPath}/Images`});
    }

    public async updateProfilePicture(request:Request,response:Response){
        if(request.files.pfp instanceof Array) return response.status(400).send(); // We only accept a single file!
        const userData:UserData = JSON.parse(request.params.user);
        const newProfilePicture:UploadedFile = request.files.pfp;
        try{
            const dirPath = `${this.assetsPath}/Images`;
            const fileExtension = path.extname(newProfilePicture.name);
            const fileName = path.basename(newProfilePicture.name);
            
            // Generate a unique filename
            let securityExtra = uuidv4();
            while(await fs.existsSync(`${dirPath}/${fileName}_${securityExtra}${fileExtension}`))
                securityExtra = uuidv4();
            const finalName = `${fileName}_${securityExtra}${fileExtension}`;
            
            // Store the new profile picture
            await newProfilePicture.mv(`${dirPath}/${finalName}`); 
           
            // Deletes the old Profile picture.
            if(userData.profilePicture !== DEFAULTPFP)
                await fsAsync.unlink(`${dirPath}/${userData.profilePicture}`); 
            
            userData.profilePicture = finalName;
            await this.dbAccess.updateEntryAsync(userData);
            response.status(200).send();
        }catch(error){
            request.log.error(error);
            response.sendStatus(500);
        }
    }

    public async refreshToken(request:Request, response:Response){
        const refreshToken:Token = request.body;
        try{
            const newToken = await this.jwtProvider.getNewToken(refreshToken);
            if(newToken === null) 
            {
                return response.status(401).send("Access Denied!");
            }
    
            return response.status(200).send(newToken);
        }catch(error){
            request.log.error(error);
            response.sendStatus(500);
        }
    }

    public async tokenLogin(request:Request, response:Response){
        // We remove the password of the user as a safety precaution.
        const userData:UserData = JSON.parse(request.params.user);

        userData.password = null;
        return response.status(200).send(userData);
    }

    public async updateNickname(request:Request, response:Response){
        const userData:UserData = JSON.parse(request.params.user);
        const req:UpdateNicknameRequest = request.body;

        try{
            req.password = hasha(req.password);
        }catch(error){
            request.log.error(error);
            return response.status(400).send("Password cannot be empty null or consist only of whitespaces.");
        }
        
        const usersFromDB = await this.dbAccess.retrieveEntriesByFilterAsync({username: userData.username, password: req.password});
        if(usersFromDB.length !== 0)
        {
            const user = usersFromDB[0];
            user.nickname = req.newNickname;
            await this.dbAccess.updateEntryAsync(user);

            user.password = null;
            return response.status(200).send(user);
        }
        else
            return response.status(401).send("Access Denied!");
    }

    public async updatePassword(request:Request, response:Response){
        const userData:UserData = JSON.parse(request.params.user);
        const req:UpdatePasswordRequest = request.body;

        try{
            req.oldPassword = hasha(req.oldPassword);
        }catch(error){
            request.log.error(error);
            return response.status(400).send("Password cannot be empty null or consist only of whitespaces.");
        }

        const usersFromDB = await this.dbAccess.retrieveEntriesByFilterAsync({username: userData.username, password: req.oldPassword});

        if(usersFromDB.length !== 0)
        {
            try{
                const user = usersFromDB[0];
                user.password = hasha(req.newPassword);
                await this.dbAccess.updateEntryAsync(user);

                user.password = null;
                return response.status(200).send(user);
            }catch(error){
                request.log.error(error);
                response.sendStatus(500);
            }
        }
        else
            return response.status(401).send("Access Denied!");
    }

    private assignExcessData(from:RegistrationRequest, to:UserData){
        if(from.nickname !== undefined)to.nickname = from.nickname;
    }
}