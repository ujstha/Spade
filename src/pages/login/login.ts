import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Slides } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenProvider } from '../../providers/token/token';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;
  username: string;
  email: string;
  password: string;

  loader: any;
  tabElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authProviders: AuthProvider, private tokenProvider: TokenProvider, private alertCtrl: AlertController, private loaderCtrl: LoadingController) {
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
    if(this.tabElement) {//if statement to check if the display is on for tabbar since it will throw error if not.
      (this.tabElement as HTMLElement).style.display = 'none';//only work when tabElement is on.
    }
  }

  ionViewWillEnter(){
    if(this.tabElement) {
      (this.tabElement as HTMLElement).style.display = 'none';
    }
  }

  //login user function and relative function begins here.

  LoginUser() {
    this.ShowLoader();
    this.authProviders
      .LoginUser(this.username, this.password)
      .subscribe(
        data => {
          this.tokenProvider.SetToken(data.token);//sets the token before redirecting to another page.
          setTimeout(() => {
            this.loader.dismiss();
            //if token provider placed here token will be set after redirecting to another page.
            this.navCtrl.setRoot('MenuPage');//instead of push method(creates back button), setRoot method sets redirected page as main page.
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

  DisplayErrorAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Log In Error',
      subTitle: `${message}`,
      buttons: ['Dismiss'],
      cssClass: 'alertCss'//change name
    });
    alert.present();
  }

  ShowLoader() {
    this.loader = this.loaderCtrl.create({
      content: 'Logging In....'
    });
    this.loader.present();
  }

  //function for sliding login and signup page begins here.

  SignUpPage(){
    this.SwipedTabsSlider.slideTo(2, 500);
  }

  LoginPage(index) {
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  //Registering User function and relative function begins here.

  SignUpUser() {
    this.ShowLoaderSignUp();
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
            this.DisplayErrorAlertSignUp(err.error.msg[0].message);
          }

          if (err.error.message) {//checking for server or bcrypt error
            this.DisplayErrorAlertSignUp(err.error.message);
          }
        }
      );
  }

  DisplayErrorAlertSignUp(message) {
    let alert = this.alertCtrl.create({
      title: 'Sign Up Error',
      subTitle: `${message}`,
      buttons: ['Dismiss'],
      cssClass: 'alertCss'//change name
    });

    alert.present();
  }

  ShowLoaderSignUp() {
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
          handler: (index) => {
            this.SwipedTabsSlider.slideTo(index, 500);
          }
        }
      ]
    });
    alert.present();
  }
  
}
