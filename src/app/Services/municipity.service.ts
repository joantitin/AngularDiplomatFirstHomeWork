import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Municipality } from '../Models/municipality-model';


@Injectable({
  providedIn: 'root'
})
export class MunicipityService {

  baseUrl = environment.api.baseUrl;
  constructor(private httpClient: HttpClient) { }

  getAllMunicipities() {
    return this.httpClient.get<Array<Municipality>>(`${this.baseUrl}/Municipality`).toPromise();
  }
}
