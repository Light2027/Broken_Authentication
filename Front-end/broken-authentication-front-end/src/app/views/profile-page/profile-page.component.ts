import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BackEndConnectionSettings } from 'src/app/models/back-end-connection-settings';
import { UserService } from 'src/app/services/user.service';
import { UserData } from '../../../../../../Shared/models/models/user-data.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [MessageService]
})
export class ProfilePageComponent implements OnInit {
  public uploadURI:string;
  public user:UserData | null;
  public pfp:any;

  constructor(public connectionSettings:BackEndConnectionSettings, public userService:UserService, private messageService:MessageService) 
  {
    this.uploadURI = `${connectionSettings.url}:${connectionSettings.port}/api/user/pfp`;
    this.user = null;
    this.pfp = null;
  }

  ngOnInit(): void {
    this.userService.getUser()
    .then(res => {
      this.user = res;
      this.getAndSetProfilePicture();
    })
    .catch(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to get user data, error: ${error.error}.`,
        life: 2000,
        closable:false
      });
    });
  }

  public onUploaded(event:any){
    this.getAndSetProfilePicture();
  }

  public onProfileUpdated(user:UserData){
    this.user = user;
  }

  private async getAndSetProfilePicture():Promise<void>{
    this.userService.getProfilePicture().then(pfp => {
      // This is getting ridiculous...
      let reader = new FileReader();
      reader.addEventListener("load", () => {
         this.pfp = reader.result;
      }, false);
   
      if (pfp) {
         reader.readAsDataURL(pfp);
      }
    })
    .catch(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to get profile picture, error: ${error.error}.`,
        life: 2000,
        closable:false
      });
    });
  }
}
