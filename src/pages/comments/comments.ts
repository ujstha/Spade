import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import moment from 'moment';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from '@ionic-tools/emoji-picker';

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  @ViewChild(Content) contentDiv: Content;
  post: any;
  tabElement: any;
  comment: string;
  commentsArray = [];
  socket: any;
  
  public eventMock;
  public eventPosMock;

  public direction =
    Math.random() > 0.5
      ? Math.random() > 0.5
        ? 'top'
        : 'bottom'
      : Math.random() > 0.5
        ? 'right'
        : 'left';
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;

  constructor(public navCtrl: NavController, public navParams: NavParams, private postProvider: PostProvider) {
    this.post = this.navParams.get('post'); //post is a key name
    this.tabElement = document.querySelector('.tabbar.show-tabbar');//selecting elementing to show/hide tabs in certain page
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CommentsPage');
    this.GetSinglePost();

    this.socket.on('refreshPage', () => {
      this.GetSinglePost();
    });
  }

  ionViewWillEnter(){
    (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave(){
    (this.tabElement as HTMLElement).style.display = 'flex';
  }

  GetSinglePost() {
    this.postProvider.GetPost(this.post._id).subscribe(data => {
      this.commentsArray = data.post.comments.reverse();
    });
  }

  AddComment() {
    if (this.comment) {
      this.postProvider.AddComment(this.post._id, this.comment).subscribe(
        data => {
          this.comment = '';
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
    }
  }

  HandleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    if(this.comment) {
      this.comment = this.comment + this.content;
    } else {
      this.comment = this.content;
    }

    this.toggled = !this.toggled;
    this.content = '';
  }

  HandleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${
      event.caretOffset
    }, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }

  GetCommentTime(time) {
    return moment(time).fromNow();
  }
}
