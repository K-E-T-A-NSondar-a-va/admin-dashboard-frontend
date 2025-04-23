import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private publicUrls: string[] = [
   "http://localhost:7038/api/v1/dashboard/login",
   "http://localhost:7038/api/v1/dashboard/get-image"
  ]

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isPublicUrl = this.publicUrls.some(uri => req.url.startsWith(uri));
    
    if(isPublicUrl) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');

    if(token) {

      const clonedReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      })

      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
