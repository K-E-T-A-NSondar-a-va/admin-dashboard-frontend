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
  currentPageSize = 10;
  totalElements = 0;
  constructor(private httpService: HttpServiceService) { }

  selectedUser: any | null = null;

  ngOnInit() {
    this.httpService.getUserPage(0, 10).subscribe((rs:any) => {
      console.log('rs => ',rs);
      this.paginatedUsers = rs.content;
      this.currentPage = rs.pageable.pageNumber
      this.totalPages = rs.totalPages;
      this.totalElements = rs.totalElements;
    });
  }

  openModal(user: any): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = null;
  }

  filterData() {
    this.paginatedUsers = this.paginatedUsers.filter((user:any) => {
      const searchLower = this.searchQuery.toLowerCase();
      return user.name.toLowerCase().includes(searchLower) ||
             user.username.toLowerCase().includes(searchLower) ||
             user.dob.toLowerCase().includes(searchLower);
    });

    if(this.searchQuery.length == 0){
      window.location.reload();
    }
  }

  deleteUser(userId: number) {
    this.paginatedUsers = this.paginatedUsers.filter((user:any) => user.id != userId);

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

submitEdit(): void {
  if (this.selectedUser) {
    this.httpService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        // Refresh the current page to show updated data
        this.changePage(this.currentPage);
        this.closeModal();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
}


}
