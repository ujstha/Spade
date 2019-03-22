import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TokenProvider } from '../../providers/token/token';
import { UsersProvider } from '../../providers/users/users';
import { MessageProvider } from '../../providers/message/message';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {
  token: any;
  socket: any;
  chatListArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private tokenProvider: TokenProvider, private usersProvider: UsersProvider, private messageProvider: MessageProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatListPage');
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
      this.chatListArray = data.result.chatList;
    });
  }

  ChatPage(chat) {//chat object from html
    //console.log(chat)
    this.navCtrl.push('ChatPage', {
      receiverId: chat.receiverId._id,
      receiverName: chat.receiverId.username
    });

    this.messageProvider
      .MarkMessages(this.token.username, chat.receiverId.username)
      .subscribe(
        data => {
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
  }

  GetTime(time) {
    const currentDate = new Date();
    const date = new Date(time);

    const d1 = moment(new Date(currentDate));
    const d2 = moment(new Date(date));
    const d3 = d1.diff(d2, 'days');

    if (d3 === 0) {
      return moment(time).format('LT');
    } else {
      return moment(time).format('DD/MM/YY');
    }
  }

  CheckIfFalse(arr, name) {//to show unread message number to receiver and not sender
    let total = 0;
    _.forEach(arr, val => {
      if (val.isRead === false && val.receivername !== name) {
        total += 1;
      }
    });
    return total;
  }
}
