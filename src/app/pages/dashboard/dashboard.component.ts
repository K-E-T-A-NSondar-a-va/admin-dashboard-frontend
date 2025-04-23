import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);

  userDetails: any;

  username = localStorage.getItem('username');

  profileIamgeUrl = '';

  constructor(private httpService: HttpServiceService) { }

  ngOnInit(): void {
    if(this.username != null) {
      this.httpService.getUserDetails(this.username).subscribe((rs: any) => {
        this.userDetails = rs;
        console.log('profile image name: ',rs.profileImageName);
        this.profileIamgeUrl = "http://localhost:7038/api/v1/dashboard/get-image/"+rs.profileImageName;
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  getImageUrl() {
    console.log('image url: ', this.profileIamgeUrl);
  }

}
