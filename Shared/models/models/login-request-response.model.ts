import { Token } from "./token.model";
import { UserData } from "./user-data.model";

export class LoginRequestResponse{
    constructor(public user:UserData, public token:Token, public refreshToken:Token){}
}