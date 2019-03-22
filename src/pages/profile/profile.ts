import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userData: any;
  userprofile: string;
  headerImage: any;
  userFriends: any;
  token: any;
  userImages: any;
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tokenProvider: TokenProvider, private sanitizer: DomSanitizer, private usersProvider: UsersProvider) {
    this.userprofile = 'posts';
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
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
      this.userData = data.result;
      this.UserImage(this.userData);
      this.userImages = { hasImages: true, user: this.userData };
    });
  }

  UserImage(obj) {
    const imgUrl = `http://res.cloudinary.com/doo4zgtkg/image/upload/v${
      obj.picVersion
    }/${obj.picId}`;
    this.headerImage = this.sanitizer.bypassSecurityTrustStyle(
      `url(${imgUrl})`
    );
  }

  SegmentChanged(event) {
    if (event._value === 'following') {
      this.userFriends = { isFollowing: true, user: this.userData };
    }

    if (event._value === 'followers') {
      this.userFriends = { isFollowing: false, user: this.userData };
    }
  }

  SettingsPage() {
    this.navCtrl.push('SettingsPage');
  }
}
