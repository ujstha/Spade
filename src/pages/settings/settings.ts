import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import { UsersProvider } from '../../providers/users/users';
import { DomSanitizer } from '@angular/platform-browser';
import io from 'socket.io-client';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  tabElement: any;
  token: any;
  socket: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userImages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tokenProvider: TokenProvider, private usersProvider: UsersProvider, private sanitizer: DomSanitizer) {
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
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
  
  ionViewWillEnter() {
    (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave() {
    (this.tabElement as HTMLElement).style.display = 'flex';
  }

  ChangePasswordPage() {
    this.navCtrl.push('ChangePasswordPage');
  }

  Logout() {
    this.tokenProvider.DeleteToken();
    this.navCtrl.setRoot('IndexPage');
  }
}
