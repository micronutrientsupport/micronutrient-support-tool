import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NotificationType } from './notificationType.enum';

export interface NotificationData {
  message: string;
  type: NotificationType;
  duration: number;
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public notificationString: string;
  public notificationType = NotificationType;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public notificationData: NotificationData,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) { }

  ngOnInit(): void {
    this.notificationString = this.notificationData.message;
  }

}
