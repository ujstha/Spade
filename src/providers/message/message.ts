import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const BASEURL = 'https://hakunamatata-server.herokuapp.com/api/hakunamatata';

@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient) {}

  SendMessage(senderId, receiverId, receiverName, message, image): Observable<any> {
    return this.http.post(
      `${BASEURL}/chat-messages/${senderId}/${receiverId}`,
      {
        receiverId,
        receiverName,
        message,
        image
      }
    );
  }

  GetAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${BASEURL}/chat-messages/${senderId}/${receiverId}`);
  }

  MarkMessages(sender, receiver): Observable<any> {
    return this.http.get(`${BASEURL}/receiver-messages/${sender}/${receiver}`);
  }

  MarkAllMessages(): Observable<any> {
    return this.http.get(`${BASEURL}/mark-all-messages`);
  }
}
