import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from './notification.component';
import { NotificationType } from './notificationType.enum';

@Injectable()
export class UserNotificationsService {

  constructor(private newNotification: MatSnackBar) {
  }

  public sendPositive(message: string, showFor: number = 3000): void {
    this.sendNotification(message, NotificationType.POSITIVE, showFor);
  }
  public sendNegative(message: string, showFor: number = 3000): void {
    this.sendNotification(message, NotificationType.NEGATIVE, showFor);
  }
  public sendWarning(message: string, showFor: number = 3000): void {
    this.sendNotification(message, NotificationType.WARNING, showFor);
  }
  public sendNotification(message: string, type: NotificationType, showFor: number = 3000): void {
    this.newNotification.openFromComponent(NotificationComponent, {
      panelClass: ['myhaz-snackbar'],
      duration: showFor,
      data: {
        message,
        type
      }
    });
  }

}
