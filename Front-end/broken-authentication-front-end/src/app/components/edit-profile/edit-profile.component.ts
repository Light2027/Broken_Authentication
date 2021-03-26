import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { PasswordValidator, NicknameValidator } from 'src/app/validators/user-data.validator';
import { UpdateNicknameRequest } from '../../../../../../Shared/models/models/update-nickname-request.model';
import { UpdatePasswordRequest } from '../../../../../../Shared/models/models/update-password-request.model';
import { UserData } from '../../../../../../Shared/models/models/user-data.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  providers:[MessageService]
})
export class EditProfileComponent implements OnInit {
  public updateNicknameForm:UpdateNicknameRequest;
  public updatePasswordForm:UpdatePasswordRequest;

  public nicknameFormGroup:FormGroup;
  public passwordFormGroup:FormGroup;
  public confirmationNewPassword:string;

  public canClickUpdateNicknameButton:boolean;
  public canClickUpdatePasswordButton:boolean;

  constructor(public userService:UserService, private formBuilder:FormBuilder, private messageService:MessageService) {
    this.canClickUpdateNicknameButton = true;
    this.canClickUpdatePasswordButton = true;
    this.updateNicknameForm = new UpdateNicknameRequest("", "");
    this.updatePasswordForm = new UpdatePasswordRequest("","");
    this.confirmationNewPassword = "";
    this.nicknameFormGroup = this.formBuilder.group({
      newNickname:new FormControl(this.updateNicknameForm.newNickname, [Validators.required, NicknameValidator()]),
      password:new FormControl(this.updateNicknameForm.password, [Validators.required]),
    });
    this.passwordFormGroup = this.formBuilder.group({
      oldPassword:new FormControl(this.updatePasswordForm.oldPassword, [Validators.required]),
      newPassword:new FormControl(this.updatePasswordForm.newPassword, [Validators.required, PasswordValidator()]),
      confirmationNewPassword:new FormControl(this.confirmationNewPassword, [Validators.required]),
    });
   }

   @Output() updated = new EventEmitter<UserData>();

  ngOnInit(): void {
    this.userService.getUser()
    .then(res =>{
      if(res === null) {
        throw new Error("Why are you here?");
      };

      this.updateNicknameForm = new UpdateNicknameRequest(res.nickname, "");
    }).catch(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to get user data, error: ${error.error}.`,
        life: 2000,
        closable:false
      });
    });
  }

  public updateNickname():void{
    this.canClickUpdateNicknameButton = false;
    this.userService.updateNickname(this.updateNicknameForm)
    .then(res => {
      this.updateNicknameForm = new UpdateNicknameRequest(res.nickname, "");
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully updated Nickname.',
        life: 2000,
        closable:false
      });
      this.updated.emit(res);
    })
    .catch(error => {
        this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to get update nickname, error: ${error.error}.`,
        life: 2000,
        closable:false
      });
    })
    .finally(() => this.canClickUpdateNicknameButton = true);
  }

  public updatePassword():void{
    this.canClickUpdatePasswordButton = false;
    this.userService.updatePassword(this.updatePasswordForm)
    .then(res => {
      this.updatePasswordForm = new UpdatePasswordRequest("","");
      this.confirmationNewPassword = "";
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully updated Password.',
        life: 2000,
        closable:false
      });
      this.updated.emit(res); // I am doing this just because...
    })
    .catch(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to get update password, error: ${error.error}.`,
        life: 2000,
        closable:false
      });
    })
    .finally(() => this.canClickUpdatePasswordButton = true);
  }

  public passwordsMatch():boolean{
    return this.updatePasswordForm.newPassword === this.confirmationNewPassword;
  }
}
