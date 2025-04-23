import { Component } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  users: any;

  searchQuery: string = '';

  currentPage = 1;
  totalPages = 1;
  paginatedUsers:any;
  constructor(private httpService: HttpServiceService) { }

  selectedUser: any | null = null;

  ngOnInit() {
    this.httpService.getUserPage(0, 10).subscribe((rs:any) => {
      console.log('rs => ',rs);
      this.paginatedUsers = rs.content;
      this.currentPage = rs.pageable.pageNumber
      this.totalPages = rs.totalPages;
    });
  }

  openModal(user: any): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = null;
  }

  filterData() {}

  deleteUser(userId: number) {
    this.paginatedUsers.filter((user:any) => user.id != userId);

    this.httpService.deleteUser(userId).subscribe(
      (rs) => { 
        console.log('response => ',rs);
      },
      (error) => {
        console.log('something went wrong: ',error)
      }
    )
  }

  changePage(pageNum: number) {
    this.httpService.getUserPage(pageNum, 10).subscribe(
      (rs:any) => { 
        this.paginatedUsers = rs.content 
        this.currentPage = rs.pageable.pageNumber
      }
    )
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.changePage(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage >= 1) {
      this.currentPage--;
      this.changePage(this.currentPage);
    }
  }


 editUser: any = {};

submitEdit(): void {
  const updatedFields: any = {};

  for (const key in this.editUser) {
    if (this.editUser[key] !== this.selectedUser[key]) {
      updatedFields[key] = this.editUser[key];
    }
  }

  if (Object.keys(updatedFields).length > 0) {
    const userIndex = this.users.findIndex((u:any) => u.id === this.selectedUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updatedFields
      };
    }

    // Optionally send PATCH request to API:
    // this.http.patch(`/api/users/${this.selectedUser.id}`, updatedFields).subscribe(...);

    console.log('Updated Fields:', updatedFields);
  }

  this.closeModal(); 
}


}
