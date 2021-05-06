import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { NotificationsService } from '../notifications/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;

  constructor(public snackbar: NotificationsService) {}

  sendInformativeNotification(): void {
    this.snackbar.sendInformative('Measure of MND changed to', 'Diet Data');
  }
  sendNegativeNotification(): void {
    this.snackbar.sendNegative('An error occured', 'some data could not be loaded');
  }
  sendPositiveNotification(): void {
    this.snackbar.sendPositive('Success', 'data upload worked!');
  }
}
