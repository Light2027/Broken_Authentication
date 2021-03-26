import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.extra(req, next));
    }

    private async extra(req: HttpRequest<any>, next: HttpHandler):Promise<HttpEvent<any>>{
        let accessToken = await this.authService.getAccessToken();
        if(accessToken === null) return next.handle(req).toPromise();

        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken?.value}`
          }
        });

        return next.handle(req).toPromise();
    }
}