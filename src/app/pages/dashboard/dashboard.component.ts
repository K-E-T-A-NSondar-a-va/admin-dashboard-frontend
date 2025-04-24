import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from '../../services/http-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  username = localStorage.getItem('username') || '';
  profileIamgeUrl = '';
  isEditing = false;
  editForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private httpService: HttpServiceService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      dob: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(this.username) {
      this.loadUserDetails();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserDetails() {
    this.httpService.getUserDetails(this.username).subscribe((rs: any) => {
      this.userDetails = rs;
      this.profileIamgeUrl = "http://localhost:7038/api/v1/dashboard/get-image/"+rs.profileImageName;
      this.editForm.patchValue({
        name: rs.name,
        contactNumber: rs.contactNumber,
        gender: rs.gender,
        address: rs.address,
        pinCode: rs.pinCode,
        dob: this.formatDateForInput(rs.dob)
      });
    });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserDetails();
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = { ...this.editForm.value };
      // Convert the date back to ISO format for the backend
      if (formData.dob) {
        formData.dob = new Date(formData.dob).toISOString();
      }
      this.httpService.updateUser(this.userDetails.id, formData).subscribe({
        next: (response) => {
          this.isEditing = false;
          this.loadUserDetails();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

  updateProfilePicture() {
    if (this.selectedFile && this.username) {
      const formData = new FormData();
      formData.append('profilePic', this.selectedFile);
      
      this.httpService.updateProfilePic(this.username, formData).subscribe({
        next: (response) => {
          this.selectedFile = null;
          this.previewUrl = null;
          this.loadUserDetails();
        },
        error: (error) => {
          console.error('Error updating profile picture:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadUserDetails();
  }
}
