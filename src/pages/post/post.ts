import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import io from 'socket.io-client';
import { PostProvider } from '../../providers/post/post';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  socket: any;
  post: string;
  image: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private postProvider: PostProvider, private alertCtrl: AlertController) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PostPage');
  }

  AddPost() {
    let body;
    if (!this.post) {
      body = {
        image: this.image
      };
    } else if (!this.image) {
      body = {
        post: this.post
      };
    } else {
      body = {
        post: this.post,
        image: this.image
      };
    }
    this.postProvider.AddPost(body).subscribe(data => {
      this.post = '';
      this.image = '';
      document.getElementById('imageName').innerHTML = '';
      this.socket.emit('refresh', {});
    });
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
      this.image = 'data:image/jpeg;base64,' + img;
      document.getElementById('imageName').innerHTML = '<img src="data:image/jpeg;base64,'+img+'">';
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
      this.image = 'data:image/jpeg;base64,' + img;
      document.getElementById('imageName').innerHTML = '<img src="data:image/jpeg;base64,'+img+'">';
    });
  }

  GoBack(){
    this.navCtrl.pop();
    //pop to remove the modal
  }

  presentOptions() {
    let alert = this.alertCtrl.create({
      title: 'Options',
      message: 'Choose an option to upload picture',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.GalleryImage();
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.CameraImage();
          }
        }
      ]
    });
    alert.present();
  }
}
