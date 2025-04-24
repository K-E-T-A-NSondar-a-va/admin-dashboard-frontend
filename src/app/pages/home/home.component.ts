import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoggedIn = false;
  numUsers = 0;


    constructor(private authService: AuthServiceService, private httpService: HttpServiceService) {
      this.isLoggedIn = authService.isLoggedIn();
      
    }
    isGenerating = false;

    generateUsers() {
      if(this.numUsers > 0 && this.numUsers < 51) {
        this.isGenerating = true;
        this.httpService.generateUsers(this.numUsers).subscribe({
          next: (res: any) => {
            this.isGenerating = false;
            alert("Users generated successfully");
            console.log(res);
          },
          error: (error: any) => {
            this.isGenerating = false;
            alert("Error occured while generating users");
            console.log(error);
          }
        });
      }
      else {
        alert("Number of users must be between 1 and 50");
      }
    }
}
