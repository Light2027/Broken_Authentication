import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackEndConnectionSettings } from '../models/back-end-connection-settings';
import { UserData } from '../../../../../Shared/models/models/user-data.model';
import { LoginRequestResponse } from '../../../../../Shared/models/models/login-request-response.model';
import { LoginRequest } from '../../../../../Shared/models/models/login-request.model';
import { RegistrationRequest } from '../../../../../Shared/models/models/registration-request.model';
import { AuthService } from './auth.service';
import { UpdateNicknameRequest } from '../../../../../Shared/models/models/update-nickname-request.model';
import { UpdatePasswordRequest } from '../../../../../Shared/models/models/update-password-request.model';
import { clone } from '../../../../../Shared/utilities/clone.utility';


@Injectable({
  providedIn: 'root'
})
export class UserService{
  private user:UserData|null;
  private apiURI:string;
  constructor(private connectionSettings:BackEndConnectionSettings, private http:HttpClient, private authService:AuthService) {
    this.user = null;
    this.apiURI = `${connectionSettings.url}:${connectionSettings.port}/api/user`;
   }

  public async login(request:LoginRequest):Promise<void>{
    let loginURI = `${this.apiURI}/login`;
    let toPost = clone(request);
    const loginRequestResponse = await this.http.post<LoginRequestResponse>(loginURI, toPost).toPromise();
    this.authService.setAccessToken(loginRequestResponse.token); 
    this.authService.setRefreshToken(loginRequestResponse.refreshToken);
    this.user = loginRequestResponse.user;
  }

  public async registerUser(request:RegistrationRequest):Promise<void>{
    let registrationUri = `${this.apiURI}`;
    let toPost = clone(request);
    const loginRequestResponse = await this.http.post<LoginRequestResponse>(registrationUri, toPost).toPromise();
    this.authService.setAccessToken(loginRequestResponse.token);
    this.authService.setRefreshToken(loginRequestResponse.refreshToken);
    this.user = loginRequestResponse.user;
  }

  public async getUser():Promise<UserData|null>{
    if(this.user !== null) return this.user;
    try{
      let user = await this.http.get<UserData>(`${this.apiURI}/tokenLogin`).toPromise();
      this.user = user;
      return user;
    }
    catch(error){
      return null;
    }
  }

  public async getProfilePicture():Promise<Blob>{
    let pfpURI = `${this.apiURI}/pfp`;
    let pfp = await this.http.get(pfpURI, {
      responseType: 'blob'
    }).toPromise();
    return pfp;
  }

  public async updateNickname(request:UpdateNicknameRequest):Promise<UserData>{
    let toPost = clone(request);
    const user = await this.http.put<UserData>(`${this.apiURI}/updatenickname`, toPost).toPromise();
    this.user = user;
    return user;
  }

  public async updatePassword(request:UpdatePasswordRequest):Promise<UserData>{
    let toPost = clone(request);
    const user = await this.http.put<UserData>(`${this.apiURI}/updatepassword`, toPost).toPromise();
    this.user = user;
    return user;
  }
}
