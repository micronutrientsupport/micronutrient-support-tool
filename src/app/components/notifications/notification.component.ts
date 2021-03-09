import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { NotificationType } from './notificationType.enum';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public notificationString: string;
  public notificationType = NotificationType;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public notificationData: any,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) { }

  ngOnInit(): void {
    this.notificationString = this.notificationData.message;
  }

}
