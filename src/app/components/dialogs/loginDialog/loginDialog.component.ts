import { Component, Inject } from '@angular/core';
import { DialogData } from '../baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { NotificationsService } from '../../notifications/notification.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './loginDialog.component.html',
  styleUrls: ['./loginDialog.component.scss'],
})
export class LoginDialogComponent {
  public title = 'Please login';
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
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
        .catch((err) => {
          this.notificationsService.sendNegative('Unable to login', err);
        });
    }
  }
}
