import { Component, Inject } from '@angular/core';
import { DialogData } from '../baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { NotificationsService } from '../../notifications/notification.service';
import { DialogService } from '../dialog.service';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';

@Component({
  selector: 'app-user-login-dialog',
  templateUrl: './userLoginDialog.component.html',
  styleUrls: ['./userLoginDialog.component.scss'],
})
export class UserLoginDialogComponent {
  public title = 'Please Login';
  public awaitingResponse = false;
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
    private dialogService: DialogService,
    private loginService: UserLoginService,
  ) {}

  public handleSubmit(): void {
    this.awaitingResponse = true;
    if (this.loginForm.valid) {
      this.apiService.endpoints.user.login
        .call({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
        })
        .then((response: LoginRegisterResponseDataSource) => {
          this.notificationsService.sendPositive('Logged in!');
          this.loginService.setActiveUser(response);
          this.data.close();
        })
        .catch((err: HttpErrorResponse) => {
          this.loginService.handleLoginOrRegistrationErrorNotification(err.error);
          this.awaitingResponse = false;
        });
    }
  }

  public handleRegister() {
    this.dialogService.dialog.closeAll();
    setTimeout(() => {
      this.dialogService.openRegiesterDialog();
    }, 100);
  }
}
