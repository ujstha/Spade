import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  tabElement: any;
  passwordForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private usersProvider: UsersProvider, private alertCtrl: AlertController) {
    this.tabElement = document.querySelector('.tabbar.show-tabbar');
    this.Init();
  }

  Init() {
    this.passwordForm = this.formBuilder.group(
      {
        currentpassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: this.Validate.bind(this)
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChangePasswordPage');
  }

  ionViewWillEnter() {
    (this.tabElement as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave() {
    (this.tabElement as HTMLElement).style.display = 'flex';
  }

  OnPasswordChange() {
    this.usersProvider.ChangePassword(this.passwordForm.value).subscribe(
      data => {
        let alert = this.alertCtrl.create({
          title: 'Password Change',
          subTitle: 'Password changed successfully',
          buttons: ['Dismiss']
        });
        alert.present();
      },
      err => {
        if (err.error.msg) {
          let alert = this.alertCtrl.create({
            title: 'Validation Error',
            subTitle: `${err.error.msg[0].message}`,
            buttons: ['Dismiss']
          });
          alert.present();
        }
        if (err.error.message) {
          let alert = this.alertCtrl.create({
            title: 'Password Change Error',
            subTitle: `${err.error.message}`,
            buttons: ['Dismiss']
          });
          alert.present();
        }
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }
}
