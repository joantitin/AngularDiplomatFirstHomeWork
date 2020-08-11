import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../Models/user-model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.api.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Array<UserModel>>(`${this.baseUrl}/user`).toPromise();
  }

  get(userId: string) {
    return this.httpClient.get<UserModel>(`${this.baseUrl}/user/${userId}`).toPromise();
  }

  create(user: UserModel) {
    return this.httpClient.post(`${this.baseUrl}/user`, user).toPromise();
  }

  update(user: UserModel) {
    return this.httpClient.put(`${this.baseUrl}/user`, user).toPromise();
  }

  delete(userId: string) {
    return this.httpClient.delete(`${this.baseUrl}/user/${userId}`).toPromise();
  }
}
