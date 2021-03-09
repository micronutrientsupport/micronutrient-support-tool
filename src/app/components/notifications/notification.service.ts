import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationType } from './notificationType.enum';

@Injectable()
export class NotificationsService {

  constructor(private newNotification: MatSnackBar) {
  }

  public sendPositive(message: string, duration: number = 3000): void {
    this.sendNotification(message, NotificationType.POSITIVE, duration);
  }
  public sendNegative(message: string, duration: number = 3000): void {
    this.sendNotification(message, NotificationType.NEGATIVE, duration);
  }
  public sendWarning(message: string, duration: number = 3000): void {
    this.sendNotification(message, NotificationType.WARNING, duration);
  }
  public sendNotification(message: string, type: NotificationType, duration: number = 3000): void {
    this.newNotification.openFromComponent(NotificationComponent, {
      panelClass: ['maps-snackbar'],
      duration: duration,
      data: {
        message,
        type
      }
    });
  }

}
