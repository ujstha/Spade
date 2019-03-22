import { Component, Input, OnChanges } from '@angular/core';

/**
 * Generated class for the UserFriendsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-user-friends',
  templateUrl: 'user-friends.html'
})
export class UserFriendsComponent implements OnChanges {
  //text: string;

  @Input() friends;
  followingArr = [];
  followersArr = [];
  following = false;
  followers = false;

  constructor() {
    //console.log('Hello UserFriendsComponent Component');
    //this.text = 'Hello World';
  }

  ngOnChanges() {
    if (this.friends && this.friends.isFollowing) {
      this.following = true;
      this.followers = false;
      this.followingArr = this.friends.user.following;
    }

    if (this.friends && !this.friends.isFollowing) {
      this.following = false;
      this.followers = true;
      this.followersArr = this.friends.user.followers;
    }
  }
}
