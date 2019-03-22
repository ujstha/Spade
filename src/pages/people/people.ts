import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import _ from 'lodash';

/**
 * Generated class for the PeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {
  peoples = [];
  socket: any;
  token: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PeoplePage');
    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUsers(this.token.username);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUsers(this.token.username);
      });
    });
  }

  GetUsers(name) {
    this.usersProvider.GetAllUsers().subscribe(
      data => {
        _.remove(data.result, { username: name }); //this line of code removes the user from people list who is viewing the tab.
        this.peoples = data.result;
      },
      err => console.log(err)
    );
  }

  ViewProfile(value) {
    this.navCtrl.push('ViewProfilePage', { userData: value });
    this.usersProvider.ProfileNotifications(value._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }
}
