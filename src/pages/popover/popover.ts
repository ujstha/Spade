import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import _ from 'lodash';

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  user: any;
  token: any;
  socket: any;
  following = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
    this.user = this.navParams.get('user');
    this.socket = io('http://hakunamatata-server.herokuapp.com/');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PopoverPage');
    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUser(this.token._id);
      });
    });
  }

  GetUser(id) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      const result = _.find(data.result.following, [
        'userFollowed._id',
        this.user._id
      ]);
      if (result) {
        this.following = true;
      } else {
        this.following = false;
      }
    });
  }

  Follow() {
    this.usersProvider.FollowUser(this.user._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  Unfollow() {
    this.usersProvider.UnFollowUser(this.user._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }
}
