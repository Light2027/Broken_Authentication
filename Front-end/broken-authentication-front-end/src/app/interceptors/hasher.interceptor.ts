import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as hasher from "object-hash";

@Injectable()
export class HasherInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // And here I shall use black magic
    if(request.body !== null && request.body instanceof Object){
      var requestClone = request.clone();
      var body = <Object>requestClone.body;
      var bodyKeys = Object.keys(body);
      var regex = new RegExp(".*[Pp]assword$");
      bodyKeys.forEach(key => {
        if(regex.test(key)){

          // I'll have to ignore this here
          // @ts-ignore
          let password = body[key] as string;
          if(password)
          {
            // @ts-ignore
            body[key] = hasher(password);
          }
        }
      });

      return next.handle(requestClone);
    }

    return next.handle(request);
  }
}
