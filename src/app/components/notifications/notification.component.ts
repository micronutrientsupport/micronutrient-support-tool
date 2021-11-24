import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NotificationData } from './notificationData';
import { NotificationType } from './notificationType.enum';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  public notificationType = NotificationType;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public notificationData: NotificationData,
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
  ) {}
}
