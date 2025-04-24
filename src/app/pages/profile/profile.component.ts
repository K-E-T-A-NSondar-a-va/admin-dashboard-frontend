import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  profileImageUrl: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpServiceService
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.loadUserDetails(username);
    } else {
      this.router.navigate(['/user-list']);
    }
  }

  loadUserDetails(username: string) {
    this.isLoading = true;
    this.httpService.getUserDetails(username).subscribe({
      next: (response: any) => {
        this.userDetails = response;
        this.profileImageUrl = "http://localhost:7038/api/v1/dashboard/get-image/" + response.profileImageName;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.isLoading = false;
        this.router.navigate(['/user-list']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/user-list']);
  }
} 