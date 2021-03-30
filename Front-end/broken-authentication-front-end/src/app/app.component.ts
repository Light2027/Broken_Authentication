import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public menuItems:MenuItem[];
  public isUserLoggedIn:boolean;

  constructor(public authService:AuthService, public userService:UserService, private router: Router){
    this.isUserLoggedIn = false;
    router.events.subscribe(async _ => {
      this.isUserLoggedIn = await this.authService.hasAccessToken();
    });
    this.menuItems = new Array<MenuItem>();
  }

  ngOnInit(): void {
    this.menuItems = [{
      label: "Dashboard",
      routerLink:["/"],
      icon: PrimeIcons.HOME
    },
    {
      label: "Profile",
      routerLink:["/profile"],
      icon:PrimeIcons.USER
    },
    {
      label: "About",
      routerLink:["/about"],
      icon:PrimeIcons.INFO_CIRCLE
    },
  ];
  }

  logout(){
    this.authService.removeTokens();
    this.router.navigate(['login']);
  }
}
