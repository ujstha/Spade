import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TokenProvider } from '../providers/token/token';
import io from 'socket.io-client';

//import { IndexPage } from '../pages/index/index';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:string = 'TabsPage';
  socket: any;
  
  //rootPage:any = IndexPage;  --use this if imported
  //rootPage:string = 'LoginPage'; -for lazyloading the pages use type string and class name

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, private tokenProvider: TokenProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //whatever is in platform.ready will be executed first
      statusBar.styleDefault();
      splashScreen.hide();

      this.socket = io('http://hakunamatata-server.herokuapp.com');

      this.storage.get('token-authentication').then(token => {
        if (token) {
          this.tokenProvider.GetPayload().then(data => {
            const params = {
              room: 'global',
              user: data.username
            };
            this.socket.emit('online', params);
          });
          this.nav.setRoot('MenuPage');
        } else {
          this.nav.setRoot('IndexPage');
        }
      });
    });
  }
}

