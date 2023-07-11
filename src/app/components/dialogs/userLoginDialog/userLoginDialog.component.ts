import { Component, Inject } from '@angular/core';
import { DialogData } from '../baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { NotificationsService } from '../../notifications/notification.service';
import { DialogService } from '../dialog.service';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-login-dialog',
  templateUrl: './userLoginDialog.component.html',
  styleUrls: ['./userLoginDialog.component.scss'],
})
export class UserLoginDialogComponent {
  public title = 'Please Login';
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
    if (this.loginForm.valid) {
      this.apiService.endpoints.login.login
        .call({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
        })
        .then((response: unknown) => {
          this.notificationsService.sendPositive('Logged in!');
          console.log(response);
        })
        .catch((err: HttpErrorResponse) => {
          this.loginService.handleLoginOrRegistrationErrorNotification(err.error);
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
