import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
//import { Provider } from '@angular/compiler/src/core';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  username: string;
  email: string;
  password: string;

  loader: any; //variable for loader

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProviders: AuthProvider, private alertCtrl: AlertController, private loaderCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RegisterPage');
  }

  RegisterUser() {
    this.ShowLoader();
    this.authProviders
      .RegisterUser(this.username, this.email, this.password)
      .subscribe(
        data => {
          //this.tokenProvider.SetToken(data.token);//sets the token before redirecting to another page.
          setTimeout(() => {
            this.loader.dismiss();
            //if token provider placed here token will be set after redirecting to another page.
            this.presentToast();//instead of push method(creates back button), setRoot method sets redirected page as main page.
          }, 2000);
        },
        err => {
          this.loader.dismiss();
          if (err.error.msg) {//error coming from joi (signup) validation
            this.DisplayErrorAlert(err.error.msg[0].message);
          }

          if (err.error.message) {//checking for server or bcrypt error
            this.DisplayErrorAlert(err.error.message);
          }
        }
      );
  }

  BackToLogin(){
    this.navCtrl.setRoot('LoginPage');
  }

  DisplayErrorAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Sign Up Error',
      subTitle: `${message}`,
      buttons: ['Dismiss'],
      cssClass: 'alertCss'//change name
    });

    alert.present();
  }

  ShowLoader() {
    this.loader = this.loaderCtrl.create({
      content: 'Signing Up...'
    });

    this.loader.present();
  }  

  presentToast() {
    let alert = this.alertCtrl.create({
      title: 'SUCCESS',
      message: 'You have successfully Signed Up. Please Login....',
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.setRoot('LoginPage');
          }
        }
      ]
    });
    alert.present();
  }
}
