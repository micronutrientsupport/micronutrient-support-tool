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

  constructor(
    private notificationService: NotificationsService
  ) {

  }

  public testInformative(): void {
    this.notificationService.sendInformative('Measure of MND changed to', 'Biomarker Data');
  }
  public testNegative(): void {
    this.notificationService.sendNegative('An error occurred:', 'data could not be loaded');
  }
}
