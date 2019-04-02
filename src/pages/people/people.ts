import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  token: any;
  socket: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userImages: any;
  searchTerm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider, private alertCtrl: AlertController, private tokenProvider: TokenProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PeoplePage');
    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUsers(this.token.username);
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUsers(this.token.username);
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

  filterItems(searchTerm){
    return this.peoples.filter((item) => {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase());
    });  
  }

  setFilteredItems() {
    if (this.searchTerm != ''){
      if (this.peoples.length != 0) {
        this.peoples = this.filterItems(this.searchTerm);
      }
      if(this.peoples.length == 0) {
        let alert = this.alertCtrl.create({
          title: 'Not Found',
          message: `${this.searchTerm} not found. Please try again.`,
          buttons: [
            {
              text: 'Try Again',
              handler: () => {
                this.GetUsers(this.token.username);
                this.searchTerm = '';
              }
            }
          ]
        });
        alert.present();
      }
    } else {
      this.usersProvider.GetAllUsers().subscribe(
        data => {
          _.remove(data.result, { username: name }); //this line of code removes the user from people list who is viewing the tab.
          this.peoples = data.result;
        },
        err => console.log(err)
      );
    }
  }
}
