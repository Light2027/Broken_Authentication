import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { RegistrationRequest } from '../../../../../../Shared/models/models/registration-request.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsernameValidator, PasswordValidator, NicknameValidator } from 'src/app/validators/user-data.validator';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers:[MessageService]
})
export class RegisterPageComponent implements OnInit {
  public registrationForm:RegistrationRequest;
  public formGroup:FormGroup;
  public confirmationPassword:string;
  public canClickSignUpButton:boolean

  constructor(public userService:UserService, private messageService:MessageService, private formBuilder:FormBuilder, private router: Router) {
    this.registrationForm = new RegistrationRequest("","");
    this.canClickSignUpButton = true;
    this.confirmationPassword = "";
    this.formGroup = this.formBuilder.group({
      nickname: new FormControl(this.registrationForm.nickname, [Validators.required, NicknameValidator()]),
      username: new FormControl(this.registrationForm.username, [Validators.required, UsernameValidator()]),
      password: new FormControl(this.registrationForm.password, [Validators.required, PasswordValidator()]),
      confirmationPassword: new FormControl(this.confirmationPassword, [Validators.required]),
    });
   }

  ngOnInit(): void {
  }

  public signUp():void{
    this.canClickSignUpButton = false;
    this.userService.registerUser(this.registrationForm)
    .then(() => {
      this.registrationForm = new RegistrationRequest("","");
      this.router.navigate([""]);
    })
    .catch(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to sign up, error: ${error.error}`,
        life: 2000,
        closable:false
      });
    })
    .finally(() => this.canClickSignUpButton = true);
  }

  public passwordsMatch():boolean{
    if(this.check(this.registrationForm.username, this.registrationForm.password)){
      // hier wäre noch sinnvoll vorher das passwort zu überprüfen.
      // Möglichkeit mit https://api.pwnedpasswords.com/range/{First 5 hash chars}
      // API KEY von haveibeenpwned.com notwenig
      return this.registrationForm.password === this.confirmationPassword;
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Password contains username.`,
        life: 2000,
        closable:false
      });
      return false;
    }
  }

  public check(username : string, pwd : string){

    var match = pwd.match("[a-z]+");
    if(match != null){
      return match.filter(a=> a.length > 4 && username.includes(a)).length > 0? true:false;
    }
    return false;
    }
}
