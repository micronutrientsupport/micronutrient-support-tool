import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationData } from './notificationData';
import { NotificationType } from './notificationType.enum';

@Injectable()
export class NotificationsService {
  constructor(private newNotification: MatSnackBar) {}

  public sendInformative(message: string, description?: string, duration = 3000): void {
    const notificationData: NotificationData = {
      type: NotificationType.INFORMATION,
      message: message,
      description: description,
      duration: duration,
    };
    this.sendNotification(notificationData);
  }
  public sendNegative(message: string, description?: string, duration = 12000): void {
    const notificationData: NotificationData = {
      type: NotificationType.NEGATIVE,
      message: message,
      description: description,
      duration: duration,
    };
    this.sendNotification(notificationData);
  }
  public sendPositive(message: string, description?: string, duration = 3000): void {
    const notificationData: NotificationData = {
      type: NotificationType.POSITIVE,
      message: message,
      description: description,
      duration: duration,
    };
    this.sendNotification(notificationData);
  }
  public sendNotification(notificationData: NotificationData): void {
    this.newNotification.openFromComponent(NotificationComponent, {
      panelClass: ['maps-snackbar'],
      duration: notificationData.duration,
      data: notificationData,
    });
  }
}
