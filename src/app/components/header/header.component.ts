import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogService } from '../dialogs/dialog.service';
import { UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { UserLoginService } from 'src/app/services/userLogin.service';

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
  ) {
    this.userLoginSevice.activeUserObs.subscribe((activeUser: LoginRegisterResponseDataSource | null) => {
      this.activeUser = activeUser;
      console.debug('active user', activeUser);
    });
  }

  public handleLoginDialog(): void {
    this.dialogService.openLoginDialog();
  }

  public handleLogout(): void {
    this.userLoginSevice.setActiveUser(null);
  }

  public handleGetProfile() {
    // this.apiService.endpoints.user.getProfile.call().then((response) => {
    //   console.debug(response);
    // });
  }
}
