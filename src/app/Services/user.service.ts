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

  registerUser(user: UserModel) {
    return this.httpClient.post(`${this.baseUrl}/user`, user).toPromise();
  }
}
