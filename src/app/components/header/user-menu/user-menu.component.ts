import { Component, Input } from '@angular/core';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogService } from '../../dialogs/dialog.service';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { LogoutResponse } from 'src/app/apiAndObjects/api/login/logout';
import { NotificationsService } from '../../notifications/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  @Input() activeUser: LoginRegisterResponseDataSource | null;

  constructor(
    private dialogService: DialogService,
    private apiService: ApiService,
    private userLoginService: UserLoginService,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {}

  public ROUTES = AppRoutes;
  public expanded = false;

  public handleLoginDialog(): void {
    this.dialogService.openLoginDialog();
  }

  public handleLogout(): void {
    this.apiService.endpoints.user.logout
      .call(this.userLoginService.getActiveUser())
      .then((response: LogoutResponse) => {
        if (response.success) {
          this.notificationsService.sendPositive(
            `${this.userLoginService.getActiveUser().username} successfully logged out.`,
          );
          this.userLoginService.setActiveUser(null);
          if (this.router.url.includes(this.ROUTES.PROFILE.getRouterPath())) {
            this.router.navigate(['/']);
          }
        }
      });
  }

  public toggleState(): void {
    this.expanded = !this.expanded;
  }
}
