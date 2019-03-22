import { Component, Input, OnChanges } from '@angular/core';
import moment from 'moment';

/**
 * Generated class for the PostsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-posts',
  templateUrl: 'posts.html'
})
export class PostsComponent implements OnChanges {
  //text: string;

  @Input() user;
  userPosts = [];
  userData: any;

  constructor() {
    //console.log('Hello PostsComponent Component');
    //this.text = 'Hello World';
  }

  ngOnChanges() {
    if (this.user) {
      this.userPosts = this.user.posts.reverse();
      this.userData = this.user;
    }
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }
}
