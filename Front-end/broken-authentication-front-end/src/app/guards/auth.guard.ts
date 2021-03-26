import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, public router: Router) { }
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean|UrlTree> {
    let hasAccessToken = await this.authService.getAccessToken() !== null;
    if(!hasAccessToken) return this.router.createUrlTree(['/login']);
    return hasAccessToken;
  }
}
