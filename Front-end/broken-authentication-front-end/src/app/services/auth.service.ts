import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../../../../../Shared/models/models/token.model';
import { BackEndConnectionSettings } from '../models/back-end-connection-settings';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private accessTokenLocalKey:string;
  private refreshTokenLocalKey:string;
  private apiURI:string;
  private http:HttpClient;
  constructor(private connectionSettings:BackEndConnectionSettings) { 
    this.http = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    this.apiURI = `${connectionSettings.url}:${connectionSettings.port}/api`;
    this.accessTokenLocalKey = "ACCESS_TOKEN";
    this.refreshTokenLocalKey = "REFRESH_TOKEN";
  }

  public async hasAccessToken() : Promise<boolean>{
    return await this.getAccessToken() !== null;
  }

  public async getAccessToken():Promise<Token|null>{
    let tokenString:string|null = window.localStorage.getItem(this.accessTokenLocalKey);
    if(tokenString === null) return null;
    let token:Token = JSON.parse(tokenString);

    // If the token expired try to ask for a new one, using the refreshToken
    let currentTime = new Date();
    let expiryDate = new Date(token.expires);
    if(expiryDate < currentTime){
      this.removeAccessToken();
      let newToken = await this.getNewAccessToken();
      if(newToken === null) return null;
      this.setAccessToken(newToken);
      return newToken;
    }

    return token;
  }

  /**Returns tokens value */
  private async getNewAccessToken():Promise<Token|null>{
    let refreshTokenString = window.localStorage.getItem(this.refreshTokenLocalKey);
    if(refreshTokenString === null) return null;

    let refreshToken:Token = JSON.parse(refreshTokenString);
    let currentTime = new Date();
    let expiryDate = new Date(refreshToken.expires);
    if(expiryDate < currentTime)
    {
      this.removeRefreshToken();
      return null;
    }

    try {
      return await this.http.post<Token>(`${this.apiURI}/token`, refreshToken).toPromise();
    } 
    catch (error) {
      this.removeRefreshToken();
      return null;
    }
  }

  public setAccessToken(accessToken:Token){
    window.localStorage.setItem(this.accessTokenLocalKey, JSON.stringify(accessToken));
  }

  public setRefreshToken(refreshToken:Token){
    window.localStorage.setItem(this.refreshTokenLocalKey, JSON.stringify(refreshToken));
  }
  
  public removeTokens(){
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  private removeAccessToken(){
    window.localStorage.removeItem(this.accessTokenLocalKey);
  }

  private removeRefreshToken(){
    window.localStorage.removeItem(this.refreshTokenLocalKey);
  }
}
