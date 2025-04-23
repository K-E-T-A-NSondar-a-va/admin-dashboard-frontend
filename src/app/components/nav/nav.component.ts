import { Component } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  isOpen:boolean = false;

  isLoggedIn = true;

  username:string = ''

  
  constructor(private authService: AuthServiceService) {
    this.isLoggedIn = authService.isLoggedIn();
    
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  openNav() {
    console.log("nav is open: "+this.isOpen);
    // this.isOpen = true;
  }

  closeNav() {
    console.log("is close: "+this.isOpen);
    // this.isOpen = false;
  }

  toggleNav() {
    this.isOpen = !this.isOpen;
    // console.log("toggle executed..")
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  }
}
