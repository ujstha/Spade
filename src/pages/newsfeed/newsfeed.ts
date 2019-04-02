import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import moment from 'moment';
import { TokenProvider } from '../../providers/token/token';
import _ from 'lodash';
import io from 'socket.io-client';
import { UsersProvider } from '../../providers/users/users';
import 'rxjs/add/operator/map';

/**
 * Generated class for the NewsfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsfeed',
  templateUrl: 'newsfeed.html',
})
export class NewsfeedPage {
  newsfeeds: any;
  newsfeedArray = [];
  socket: any;
  user: any;
  topNewsfeedArray = [];
  token: any;
  userData: any;
  userprofile: string;
  headerImage: any;
  userImages: any;
  peoples = [];
  searchTerm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private alertCtrl: AlertController, private usersProvider: UsersProvider, private postProvider: PostProvider, private tokenProviders: TokenProvider) {
    this.newsfeeds = 'post';
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NewsfeedPage'); this function is a lifecycle event
    this.tokenProviders.GetPayload().then(value => {
      this.user = value;
      this.token = value;
      this.GetUsers(this.token._id);
      this.GetUser(this.token._id);
    });
    this.GetAllPosts();

    this.socket.on('refreshPage', () => {
      this.GetAllPosts();
      this.tokenProviders.GetPayload().then(value => {
        this.token = value;
        this.GetUsers(this.token._id);
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

  GetAllPosts() {
    this.postProvider.GetAllPosts().subscribe(
      data => {
        this.newsfeedArray = data.posts;
        this.topNewsfeedArray = data.top;
      },
      err => {
        if (err.error.token === null) {
          this.tokenProviders.DeleteToken();
          this.navCtrl.setRoot('LoginPage');
        }
      }
    );
  }

  LikePost(post) {
    this.postProvider.AddLike(post).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  AddComment(post) {
    this.navCtrl.push('CommentsPage', { post });
  }

  /*PostModal() {
    let modal = this.modalCtrl.create('PostPage');
    modal.present();
  }*/

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  GetUsers(id) {
    this.usersProvider.GetAllUsers().subscribe(
      data => {
        //this line of code removes the user from people list who is viewing the tab.
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
    return this.newsfeedArray.filter((item) => {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase());
    });  
  }

  setFilteredItems() {
    if (this.searchTerm != ''){
      if (this.newsfeedArray.length != 0) {
        this.newsfeedArray = this.filterItems(this.searchTerm);
      }
      if(this.newsfeedArray.length == 0) {
        let alert = this.alertCtrl.create({
          title: 'Not Found',
          message: `${this.searchTerm} not found. Please try again.`,
          buttons: [
            {
              text: 'Try Again',
              handler: () => {
                this.GetAllPosts();
                this.searchTerm = '';
              }
            }
          ]
        });
        alert.present();
      }
    } else {
      this.postProvider.GetAllPosts().subscribe(
        data => {
          this.newsfeedArray = data.posts;
          this.topNewsfeedArray = data.top;
        });
    }
  }
}
