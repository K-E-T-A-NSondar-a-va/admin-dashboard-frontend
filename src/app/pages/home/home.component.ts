import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoggedIn = false;

    constructor(private authService: AuthServiceService) {
      this.isLoggedIn = authService.isLoggedIn();
      
    }
}
