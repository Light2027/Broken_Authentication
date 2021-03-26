import * as express from "express";
import * as fileupload from "express-fileupload";
import * as bodyParser from "body-parser"
import * as cors from "cors";
import * as pino from "pino";
import * as pinoHttp from "pino-http";

import * as appSettings from "./appsettings.json";
import { RethinkDBAccessService } from "./services/rethinkdb-access.service";
import { DatabaseController } from "./controllers/database.controller";
import { UserData } from "../Shared/models/models/user-data.model";
import { UserController } from "./controllers/user.controller";
import { JWTProvider, RefreshToken } from "./services/jwt-provider.service";
import { JWTAuthorizationMiddleware } from "./middlewares/jwt-authorization.middleware";

var app = express();
app.use(fileupload());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors(
    {
        origin: `http://localhost:4200`
    }
));
const logger = pino({
    prettyPrint:true
});
app.use(pinoHttp({
    logger: logger,
}))

const userDBAccess = new RethinkDBAccessService<UserData>(appSettings.DBConnection.Host, appSettings.DBConnection.Port, "Users-Database", "Users");
const refreshTokenDBAccess = new RethinkDBAccessService<RefreshToken>(appSettings.DBConnection.Host, appSettings.DBConnection.Port, "Users-Database", "RefreshTokens");

userDBAccess.tryInitialize().then().catch(error => logger.error(error));
refreshTokenDBAccess.tryInitialize().then().catch(error => logger.error(error));

const jwtProvider = new JWTProvider(appSettings.AccessTokenSecret, appSettings.RefreshTokenSecret, 1, 1, refreshTokenDBAccess);
const jwtAuthorizationService = new JWTAuthorizationMiddleware(appSettings.AccessTokenSecret, userDBAccess);
const userController = new UserController(userDBAccess, jwtProvider);

const apiPrefix = "/api";
app.post(`${apiPrefix}/token`,(req,res) => userController.refreshToken(req,res));

app.get(`${apiPrefix}/user/tokenLogin`, (req,res,next) => jwtAuthorizationService.authorize(req,res, next), (req,res) => userController.tokenLogin(req,res));

app.post(`${apiPrefix}/user/login`, (req,res) => userController.loginUser(req,res));

app.post(`${apiPrefix}/user`, (req,res) => userController.createUser(req,res));

app.put(`${apiPrefix}/user/updatenickname`, (req,res,next) => jwtAuthorizationService.authorize(req,res, next) , (req,res) => userController.updateNickname(req,res));
app.put(`${apiPrefix}/user/updatepassword`, (req,res,next) => jwtAuthorizationService.authorize(req,res, next), (req,res) => userController.updatePassword(req,res));

app.get(`${apiPrefix}/user/pfp`, (req,res,next) => jwtAuthorizationService.authorize(req,res, next), (req,res) => userController.getProfilePic(req, res));
app.post(`${apiPrefix}/user/pfp`, (req,res,next) => jwtAuthorizationService.authorize(req,res, next), (req,res) => userController.updateProfilePicture(req, res)); // This cannot be put sadly...

// Check every 5 minutes if a refresh token has expired
setInterval(async () => {
    let toRemove = new Array<RefreshToken>(); 
    let refreshTokens:RefreshToken[] = undefined;
    try{
        refreshTokens = await refreshTokenDBAccess.retrieveEntriesAsync();
    }catch(error){
        logger.error(error);
        return;
    }
    
    refreshTokens.forEach(token => {
        let currentDate = new Date();
        let expiryDate = new Date(token.expires);
        if(expiryDate < currentDate)
            toRemove.push(token);
    });

    try{
        toRemove.forEach(async token => await refreshTokenDBAccess.deleteEntryAsync(token.id));
    }catch(error){
        logger.error(error);
        return;
    }
}, 60*5000);

const port:number = 3000;
app.listen(port, () => {
    logger.info(`Server started on Port ${port}.`);
});