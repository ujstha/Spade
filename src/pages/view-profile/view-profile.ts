import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  tabElement: any; 
  userData: any;
  userprofile: string;
  headerImage: any;
  userFriends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, private popOverCtrl: PopoverController){
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.userData = this.navParams.get('userData');
    this.userprofile = 'posts';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ViewProfilePage');
    this.UserImage();
  }

  ionViewWillEnter() {
    (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave() {
    (this.tabElement as HTMLElement).style.display = 'flex';
  }

  UserImage() {
    const imgUrl = `http://res.cloudinary.com/doo4zgtkg/image/upload/v${
      this.userData.picVersion
    }/${this.userData.picId}`;
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

  ChatPage(value) {
    this.navCtrl.push('ChatPage', {
      receiverId: value._id,
      receiverName: value.username
    });
  }

  OpenPopOver(event, value) {
    let popover = this.popOverCtrl.create('PopoverPage', { user: value });
    popover.present({
      ev: event
    });
  }
}

