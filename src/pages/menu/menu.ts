import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import { UsersProvider } from '../../providers/users/users';
import io from 'socket.io-client';

export interface PageInterface {
  //title: string;
  //pageName: string;
  //tabComponent?: any;
  //index?: number;
  //icon: string;
}
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = 'TabsPage';
  @ViewChild(Nav) nav: Nav;

  /*
  pages: PageInterface[] = [
    {title: 'Notification', pageName: 'NotificationsPage', icon: 'home'},
    {title: 'Chats', pageName: 'ChatListPage', icon: 'home'},
    {title: 'People', pageName: 'PeoplePage', icon: 'home'},
  ]
  */
  token: any;
  socket: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userImages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tokenProvider: TokenProvider, private usersProvider: UsersProvider) {
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
    this.headerImage = imgUrl;
  }

  GoToProfile() {
    this.navCtrl.push('ProfilePage');
  }

  SettingsPage() {
    this.navCtrl.push('SettingsPage');
  }

  Following() {
    this.navCtrl.push('FollowingPage');
  }

  Followers() {
    this.navCtrl.push('FollowersPage');
  }

  Logout() {
    this.tokenProvider.DeleteToken();
    this.navCtrl.setRoot('LoginPage');
  }

  /*
  openPage(page: PageInterface) {
    this.nav.setRoot(page.pageName);
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
  }
  */
}
