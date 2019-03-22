import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import _ from 'lodash';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})

export class TabsPage {
  token: any;
  socket: any;
  count = 0;
  messageCount = 0;

  //tab activation
  tab1 = 'NewsfeedPage';
  tab2 = 'ChatListPage';
  tab3 = 'PeoplePage';
  tab4 = 'NotificationsPage';
  tab5 = 'ProfilePage';

  constructor(public navCtrl: NavController, public navParams: NavParams, private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com/');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(value => {
      this.token = value;
      this.GetUser(this.token._id, this.token.username);
    });
  }

  ClickTab() {
    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(value => {
        this.token = value;
        this.GetUser(this.token._id, this.token.username);
      });
      this.messageCount -= 1;
      if (this.messageCount <= 0) {
        this.messageCount = null;
      }

      this.count -= 1;
      if (this.count <= 0) {
        this.count = null;
      }
    });
  }

  GetUser(id, username) {
    this.usersProvider.GetUserById(id).subscribe(data => {
      let msgArr = [];
      let countArr = [];
      _.forEach(data.result.chatList, value => {
        const msg = value.msgId.message;
        _.forEach(msg, val => {
          if (val.isRead === false && val.receivername === username) {
            msgArr.push(val);
            this.messageCount = msgArr.length;
          }
        });
      });

      _.forEach(data.result.notifications, value => {
        if (value.read === false) {
          countArr.push(value);
          this.count = countArr.length;
        }
      });
    });
  }
}
