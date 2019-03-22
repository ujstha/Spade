import { Component, Input, OnChanges } from '@angular/core';
import { UsersProvider } from '../../providers/users/users';
import io from 'socket.io-client';

/**
 * Generated class for the ImagesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-images',
  templateUrl: 'images.html'
})
export class ImagesComponent implements OnChanges {
  @Input() images;
  userImages = [];
  hasImages = false;
  socket: any;
  //text: string;

  constructor(private usersProvider: UsersProvider) {
    this.socket = io('http://hakunamatata-server.herokuapp.com');
    //console.log('Hello ImagesComponent Component');
    //this.text = 'Hello World';
  }
  ngOnChanges() {
    this.ChangesFunction();

    this.socket.on('refreshPage', () => {
      this.ChangesFunction();
    });
  }

  ChangesFunction() {
    if (this.images && this.images.hasImages) {
      this.userImages = this.images.user.images;
      this.hasImages = true;
    }

    if (this.images && !this.images.hasImages) {
      this.userImages = this.images.images;
    }
  }

  SetAsDefault(value) {
    this.usersProvider.SetDefaultImage(value.imgId, value.imgVersion).subscribe(
      () => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }
}
