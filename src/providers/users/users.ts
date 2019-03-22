import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const BASEURL = 'https://hakunamatata-server.herokuapp.com/api/hakunamatata';

@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient) {}

  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  UnFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  MarkNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarkAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get(
      `${BASEURL}/set-default-image/${imageId}/${imageVersion}`
    );
  }

  ProfileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { id });
  }

  ChangePassword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }
}