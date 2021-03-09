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

  public testPostitive(): void {
    this.notificationService.sendPositive('TEST');
  }
  public testNegative(): void {
    this.notificationService.sendNegative('TEST NEGATIVE', 100000000);
  }
  public testWarning(): void {
    this.notificationService.sendWarning('TEST WARNING');
  }
  public testCustom(): void {

  }
}
