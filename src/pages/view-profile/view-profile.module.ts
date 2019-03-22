import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProfilePage } from './view-profile';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ViewProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProfilePage),
    ComponentsModule
  ],
})
export class ViewProfilePageModule {}
