import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {

  constructor(private storage: Storage) {
    //console.log('Hello TokenProvider Provider');
  }

  SetToken(token) {
    return this.storage.set('token-authentication', token);//token-authentication is a key name
  }

  async GetToken() {
    return await this.storage.get('token-authentication');
  }

  DeleteToken() {
    this.storage.remove('token-authentication');
  }

  async GetPayload() {
    const token = await this.storage.get('token-authentication');
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(window.atob(payload));
    }

    return payload.data;
  }
}
