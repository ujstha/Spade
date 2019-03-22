import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { CaretEvent, EmojiEvent } from '@ionic-tools/emoji-picker';
import { MessageProvider } from '../../providers/message/message';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import _ from 'lodash';
import { CameraOptions, Camera } from '@ionic-native/camera';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) contentDiv: Content;
  tabElement: any;
  message: string;
  image: any;
  messageArray = [];
  sender: any;
  receiverName: any;
  receiverId: any;
  receiver: any;
  socket: any;
  typingMessage;
  typing = false;
  isOnline = false;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private messageProvider: MessageProvider, private camera: Camera, private usersProvider: UsersProvider, private tokenProvider: TokenProvider) {
    //this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.socket = io('http://hakunamatata-server.herokuapp.com');
    this.receiverId = this.navParams.get('receiverId');
    this.receiverName = this.navParams.get('receiverName');

    this.GoToBottom();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatPage');
    this.tokenProvider.GetPayload().then(value => {
      this.sender = value;
      this.GetAllMessages(this.sender._id, this.receiverId);

      const val = {
        room: 'global',
        user: this.sender.username
      };
      this.socket.emit('online', val);

      const params = {
        room1: this.sender.username,
        room2: this.receiverName
      };
      this.socket.emit('join chat', params);
    });
    
    this.GetReceiverData();

    this.socket.on('refreshPage', () => {
      this.GoToBottom();
      this.tokenProvider.GetPayload().then(value => {
        this.sender = value;
        this.GetAllMessages(this.sender._id, this.receiverId);
      });
    });

    this.SocketFunction();
  }
  

  ionViewDidEnter() {
    const params = {
      room1: this.sender.username,
      room2: this.receiverName
    };

    this.socket.emit('join chat', params);
  }

  ionViewWillEnter() {
    (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave() {
    (this.tabElement as HTMLElement).style.display = 'flex';
  }

  GoBack() {
    this.navCtrl.pop();
  }

  GetAllMessages(senderId, receiverId) {
    this.messageProvider.GetAllMessages(senderId, receiverId).subscribe(data => {
      this.messageArray = data.messages.message;
    });
  }

  GetReceiverData() {
    this.usersProvider.GetUserByName(this.receiverName).subscribe(data => {
      this.receiver = data.result;
    });
  }

  SocketFunction() {
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
      }
    });

    this.socket.on('usersOnline', data => {
      const result = _.indexOf(data, this.receiverName);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });
  }

  PrivateMessage() {
    if (!this.message && !this.image) {
      return;
    }

    this.messageProvider
      .SendMessage(
        this.sender._id,
        this.receiverId,
        this.receiverName,
        this.message,
        this.image
      )
      .subscribe(
        data => {
          this.message = '';
          this.image = '';
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
  }

  GalleryImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,//DATA_URL since it is base encoded
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      correctOrientation: true,//rotates image straight if true
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 350,
      targetHeight: 350
    };
    this.camera.getPicture(options).then(img => {
      this.image = img;
    });
  }

  CameraImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,//DATA_URL since it is base encoded
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      correctOrientation: true,//rotates image straight if true
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 350,
      targetHeight: 350
    };
    this.camera.getPicture(options).then(img => {
      this.image = img;
    });
  }

  HandleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.message + this.content;

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

  IsTyping() {
    this.socket.emit('start_typing', {
      sender: this.sender.username,
      receiver: this.receiverName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.sender.username,
        receiver: this.receiverName
      });
    }, 500);
  }

  GoToBottom() {
    setTimeout(() => {
      if (this.contentDiv._scroll) {
        this.contentDiv.scrollToBottom();
      }
    }, 500);
  }
}
