import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../../../../../Shared/models/models/login-request.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers:[MessageService]
})
export class LoginPageComponent implements OnInit {
  public loginForm:LoginRequest;
  public formGroup:FormGroup;
  public canClickLoginButton:boolean;

  constructor(public userService:UserService, private messageService:MessageService, private formBuilder:FormBuilder, private router: Router) {
    this.loginForm = new LoginRequest("","");
    this.canClickLoginButton = true;
    this.formGroup = this.formBuilder.group({
      username: new FormControl(this.loginForm.username, [Validators.required]),
      password: new FormControl(this.loginForm.password, [Validators.required]),
    });
   }

  ngOnInit(): void {
  }

  public login():void{
    this.canClickLoginButton = false;
      this.userService.login(this.loginForm)
      .then(() => {
        this.loginForm = new LoginRequest("","");
        this.router.navigate([""]);
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to login, error: ${error.error}`,
          life: 2000,
          closable:false
        });
      })
      .finally(() => this.canClickLoginButton = true);
  }
}
