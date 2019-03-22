import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {    
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
}
