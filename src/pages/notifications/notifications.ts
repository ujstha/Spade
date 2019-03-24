import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import moment from 'moment';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  payload: any;
  socket: any;
  notifications = [];
  token: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userImages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NotificationsPage');
    this.tokenProvider.GetPayload().then(value => {
      this.payload = value;
      this.token = value;
      this.GetUser(this.payload._id);
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.payload = value;
        this.token = value;
        this.GetUser(this.payload._id);
        this.GetUser(this.token._id);
      });
    });
  }

  GetUser(id) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      this.notifications = data.result.notifications.reverse();
      this.userData = data.result;
      this.UserImage(this.userData);
      this.userImages = { hasImages: true, user: this.userData };
    });
  }

  UserImage(obj) {
    const imgUrl = `http://res.cloudinary.com/doo4zgtkg/image/upload/v${
      obj.picVersion
    }/${obj.picId}`;
    this.headerImage = imgUrl;
  }

  MarkNotifications(value) {
    this.usersProvider.MarkNotification(value._id).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  DeleteNotifications(value) {
    this.usersProvider.MarkNotification(value._id, true).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  GetTime(time) {
    return moment(time).fromNow();
  }
}
