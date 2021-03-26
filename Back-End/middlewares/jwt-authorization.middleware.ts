import { Request, Response } from 'express';
import { UserData } from '../../Shared/models/models/user-data.model';
import { RethinkDBAccessService } from '../services/rethinkdb-access.service';
import * as jwt from "jsonwebtoken";
import { TokenUserData, removeJunk } from '../models/token-user-data.model';

export class JWTAuthorizationMiddleware{
    constructor(private accessSecret:string, private userAccess:RethinkDBAccessService<UserData>){
    }

    public async authorize(request:Request, response:Response, next){
        const authHeader = request.headers["authorization"];
        // JS black magic, should we have an authHeader, then split the header and get the token.
        const token = authHeader && authHeader.split(" ")[1];
        if(token){
            let tokenUserData:TokenUserData = undefined;
            try{
                tokenUserData = removeJunk(<TokenUserData>jwt.verify(token, this.accessSecret));
            }catch(error){
                return response.status(401).send("Access Denied!");
            }

            try{
                const user = await this.getUser(tokenUserData);
                request.params.user = JSON.stringify(user);
                next();
            }catch(error){
                request.log.error(error);
                return response.sendStatus(500);
            }
        }
    }

    private async getUser(token:TokenUserData):Promise<UserData>{
        var found = await this.userAccess.retrieveEntriesByFilterAsync({username:token.userName});
        if(found.length === 0)throw new Error("No user with username exists.");
        return found[0];
    }
}