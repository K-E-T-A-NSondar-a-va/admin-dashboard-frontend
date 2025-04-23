import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private httpService: HttpServiceService) { }

  login(loginCredentials: any) {
    this.httpService.login(loginCredentials).subscribe(
      (rs:any) => {
        localStorage.setItem('token',rs.token);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }


}
