import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NotificationsService } from '../notifications/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;

  constructor(public snackbar: NotificationsService) {}

  sendInformativeNotification(message: string, action: string): void {
    this.snackbar.sendInformative(message, action);
  }
  sendNegativeNotification(message: string, action: string): void {
    this.snackbar.sendNegative(message, action);
  }
  sendPositiveNotification(message: string, action: string): void {
    this.snackbar.sendPositive(message, action);
  }
}
