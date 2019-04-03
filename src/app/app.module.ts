import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MyApp } from './app.component';

import { AuthProvider } from '../providers/auth/auth';
import { TokenProvider } from '../providers/token/token';
import { TokenInterceptor } from '../providers/token-interceptor';
import { MessageProvider } from '../providers/message/message';
import { PostProvider } from '../providers/post/post';
import { UsersProvider } from '../providers/users/users';
//import { IndexPage } from '../pages/index/index';

const config = {
  apiKey: "AIzaSyBywtXzNEnaKv2AYX9fGY2EYW0TuU6qWas",
  authDomain: "spade-93c77.firebaseapp.com",
  databaseURL: "https://spade-93c77.firebaseio.com",
  projectId: "spade-93c77",
  storageBucket: "spade-93c77.appspot.com",
  messagingSenderId: "999776415645"
}

@NgModule({
  declarations: [
    MyApp
    //IndexPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    EmojiPickerModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config), 
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      iconMode: 'ios',
      mode: 'md',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
    //IndexPage
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    TokenProvider,
    MessageProvider,
    PostProvider,
    UsersProvider,
    InAppBrowser,
    Firebase,
    Camera
  ]
})
export class AppModule {}
