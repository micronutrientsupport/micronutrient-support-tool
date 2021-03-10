import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationType } from './notificationType.enum';

@Injectable()
export class NotificationsService {

  constructor(private newNotification: MatSnackBar) {
  }

  public sendInformative(message: string, boldMessage: string, duration = 3000): void {
    this.sendNotification(message, boldMessage, NotificationType.INFORMATION, duration);
  }
  public sendNegative(message: string, boldMessage: string, duration = 3000): void {
    this.sendNotification(message, boldMessage, NotificationType.NEGATIVE, duration);
  }
  // public sendWarning(message: string, boldMessage: string, duration = 3000): void {
  //   this.sendNotification(message, boldMessage, NotificationType.WARNING, duration);
  // }
  public sendNotification(message: string, boldMessage: string, type: NotificationType, duration = 3000): void {
    this.newNotification.openFromComponent(NotificationComponent, {
      panelClass: ['maps-snackbar'],
      duration: duration,
      data: {
        message,
        boldMessage,
        type
      }
    });
  }

}
