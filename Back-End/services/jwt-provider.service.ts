import { IIdentifiable } from "../../Shared/models/interfaces/identifiable.interface";
import { TokenUserData, removeJunk } from '../models/token-user-data.model';
import { Token } from '../../Shared/models/models/token.model';
import { IDatabaseAccessService } from './database-access.interface';
import * as jwt from "jsonwebtoken";

/**
 *This class serves as the JWToken provider.
 * @export
 * @class JWTProvider
 */
export class JWTProvider{
    /**
     * Creates an instance of JWTProvider.
     * @param {string} accessSecret
     * @param {string} refreshSecret
     * @param {number} tokenExpiresInMinutes
     * @param {number} refreshTokenExpiresInHours
     * @memberof JWTProvider
     */
    constructor(private accessSecret:string, private refreshSecret:string, private tokenExpiresInMinutes:number, private refreshTokenExpiresInHours:number, private refreshTokenDBAccess:IDatabaseAccessService<RefreshToken>){
    }

    /**
     *Generates a new Token using the refresh token.
     *Should the data be invalid in some way, this returns null.
     * @param {Token} refreshToken
     * @return {Promise<Token|null>}  {(Promise<Token|null>)}
     * @memberof JWTProvider
     * @throws {Error}
     */
    public async getNewToken(refreshToken:Token):Promise<Token|null>{
        if(!(await this.isRefreshTokenAlive(refreshToken))) return null;
        let tokenUserData = removeJunk(<TokenUserData>jwt.verify(refreshToken.value, this.refreshSecret));
        return this.getToken(tokenUserData);
    }

    /**
     *Generates a Token using the data of a UserTokenData instance.
     *This is to make sure that no crucial information of the user is contained in the tokens.
     * @param {TokenUserData} user
     * @return {Token}  {Token}
     * @memberof JWTProvider
     */
    public getToken(user:TokenUserData):Token{
        const expires:Date = new Date();
        expires.setMinutes(expires.getMinutes() + this.tokenExpiresInMinutes);
        const token:string = jwt.sign(JSON.parse(JSON.stringify(user)), this.accessSecret, { expiresIn: this.tokenExpiresInMinutes*60 });
        return new Token(token, expires);
    }

    /**
     * Generates a new RefreshToken based on the TokenUserData.
     * @param {TokenUserData} user
     * @return {Promise<Token>}  {Promise<Token>}
     * @memberof JWTProvider
     * @throws {Error}
     */
    public async getRefreshToken(user:TokenUserData):Promise<Token>{
        const expires:Date = new Date();
        expires.setHours(expires.getHours() + this.refreshTokenExpiresInHours);
        const tokenValue:string = jwt.sign(JSON.parse(JSON.stringify(user)), this.refreshSecret, { expiresIn: this.refreshTokenExpiresInHours*60*60 });
        const token = new Token(tokenValue, expires);
        await this.refreshTokenDBAccess.createEntryAsync(new RefreshToken(token));
        return token;
    }

    /**
     * Checks if the Refesh token is still valid/alive.
     * @private
     * @param {Token} refreshToken
     * @return {Promise<boolean>}  {Promise<boolean>}
     * @memberof JWTProvider
     */
    private async isRefreshTokenAlive(refreshToken:Token):Promise<boolean>{
        const tokens = await this.refreshTokenDBAccess.retrieveEntriesByFilterAsync({value: refreshToken.value});
        return tokens.length !== 0;
    }
}

export class RefreshToken extends Token implements IIdentifiable{
    public id: string;
    constructor(token:Token){
        super(token.value, token.expires);
    }
}