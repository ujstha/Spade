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

import { MyApp } from './app.component';

import { AuthProvider } from '../providers/auth/auth';
import { TokenProvider } from '../providers/token/token';
import { TokenInterceptor } from '../providers/token-interceptor';
import { MessageProvider } from '../providers/message/message';
import { PostProvider } from '../providers/post/post';
import { UsersProvider } from '../providers/users/users';
//import { IndexPage } from '../pages/index/index';

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
    IonicModule.forRoot(MyApp)
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
    Camera
  ]
})
export class AppModule {}
