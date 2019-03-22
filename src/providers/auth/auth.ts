import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const BASEURL = 'https://hakunamatata-server.herokuapp.com/api/hakunamatata';

@Injectable()
export class AuthProvider {

  constructor(private http: HttpClient) {
    //console.log('Hello AuthProvider Provider');
  }

  RegisterUser(username, email, password): Observable<any> {
    return this.http.post(`${BASEURL}/register`, {
      username,
      email,
      password
    });
  }

  LoginUser(username, password): Observable<any> {
    return this.http.post(`${BASEURL}/login`, {
      username,
      password
    });
  }

  GetAllUsers(): Observable<any>{
    return this.http.get(`${BASEURL}/users`);
  }
}
