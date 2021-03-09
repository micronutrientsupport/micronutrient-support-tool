import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NotificationsService } from './notification.service';
import { AppMaterialModule } from 'src/app/app-material.module';


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  providers: [
    NotificationsService,
  ],
})
export class NotificationModule { }
