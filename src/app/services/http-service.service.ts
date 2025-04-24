import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  private baseUrl = 'http://localhost:7038/api/v1/dashboard';

  constructor(private httpClient: HttpClient) { }

  login(loginReq: any) {
    return this.httpClient.post(this.baseUrl+"/login", loginReq);
  }

  getUserPage(pageNum: number, pageSize: number) {
    return this.httpClient.post(this.baseUrl+"/user/page/"+pageNum+"/"+pageSize, null);
  }

  updateUser(id: number, user: any) {
    return this.httpClient.post(this.baseUrl+"/user/update/"+id, user);
  }

  deleteUser(id: number) {
    return this.httpClient.post(this.baseUrl+"/user/delete/"+id, null);
  }

  getUserDetails(username: string) {
    return this.httpClient.post(this.baseUrl+"/user/"+username, null);
  }

  generateUsers(numUsers: number) {
    return this.httpClient.post(this.baseUrl+"/admin/generate-users/"+numUsers, null);
  }

  updateProfilePic(username: string, profilePic: FormData) {
    return this.httpClient.post(this.baseUrl + "/update-pic/" + username, profilePic);
  }

  forgotPassword(data: { username: string, email: string }) {
    return this.httpClient.post(this.baseUrl + "/forgot-password", data);
  }
}
