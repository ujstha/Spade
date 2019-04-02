import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;
  today = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser) {    
  }

  selectTab(index) {    
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad IndexPage');
  }

  Skip(){
    this.navCtrl.setRoot('LoginPage');
  }

  OpenBrowser() {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    this.iab.create('https://www.udemy.com/angular-ionic-node-build-a-real-web-mobile-chat-app/', '_self', options);
  }
}
