import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogService } from '../dialogs/dialog.service';
import { UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { LogoutResponse } from 'src/app/apiAndObjects/api/login/logout';
import { NotificationsService } from '../notifications/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public ROUTES = AppRoutes;
  public form!: UntypedFormGroup;
  public activeUser: LoginRegisterResponseDataSource | null;

  constructor(
    private dialogService: DialogService,
    private apiService: ApiService,
    private userLoginSevice: UserLoginService,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {
    this.userLoginSevice.activeUserObs.subscribe((activeUser: LoginRegisterResponseDataSource | null) => {
      this.activeUser = activeUser;
    });
  }

  public handleLoginDialog(): void {
    this.dialogService.openLoginDialog();
  }

  public handleLogout(): void {
    this.apiService.endpoints.user.logout
      .call(this.userLoginSevice.getActiveUser())
      .then((response: LogoutResponse) => {
        if (response.success) {
          this.notificationsService.sendPositive(
            `${this.userLoginSevice.getActiveUser().username} successfully logged out.`,
          );
          this.userLoginSevice.setActiveUser(null);
          if (this.router.url.includes(this.ROUTES.PROFILE.getRouterPath())) {
            this.router.navigate(['/']);
          }
        }
      });
  }
}
