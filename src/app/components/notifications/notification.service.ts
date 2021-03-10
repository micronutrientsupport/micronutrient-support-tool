import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationType } from './notificationType.enum';

@Injectable()
export class NotificationsService {

  constructor(private newNotification: MatSnackBar) {
  }

  public sendInformative(message: string, boldMessage?: string, duration = 3000): void {
    this.sendNotification(NotificationType.INFORMATION, message, boldMessage, duration);
  }
  public sendNegative(message: string, boldMessage?: string, duration = 12000): void {
    this.sendNotification(NotificationType.NEGATIVE, message, boldMessage, duration);
  }
  public sendPositive(message: string, boldMessage?: string, duration = 3000): void {
    this.sendNotification(NotificationType.POSITIVE, message, boldMessage, duration);
  }
  public sendNotification(type: NotificationType, message: string, boldMessage?: string, duration = 3000): void {
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
