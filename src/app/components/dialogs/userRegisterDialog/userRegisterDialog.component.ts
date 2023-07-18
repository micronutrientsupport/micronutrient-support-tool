import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { NotificationsService } from '../../notifications/notification.service';
import { DialogData } from '../baseDialogService.abstract';
import { UserRegistrationParams } from 'src/app/apiAndObjects/api/login/register';
import { HttpErrorResponse } from '@angular/common/http';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { DialogService } from '../dialog.service';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';

@Component({
  selector: 'app-user-register-dialog',
  templateUrl: './userRegisterDialog.component.html',
  styleUrls: ['./userRegisterDialog.component.scss'],
})
export class UserRegisterDialogComponent implements OnInit {
  public title = 'Please Register';
  public hidePw = true;
  public hideRepeatPw = true;
  public awaitingResponse = false;
  public registrationSuccessful = false;
  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    repeatPassword: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    organisation: new FormControl('', [Validators.required]),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
    private loginService: UserLoginService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.registerForm.controls['repeatPassword'].addValidators([
      this.createCompareValidator(this.registerForm.get('password'), this.registerForm.get('repeatPassword')),
    ]);
  }

  public handleSubmit(): void {
    this.awaitingResponse = true;
    if (this.registerForm.valid) {
      const regParams: UserRegistrationParams = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        name: this.registerForm.value.name,
        organisation: this.registerForm.value.organisation,
      };
      this.apiService.endpoints.user.register
        .call(regParams)
        .then((response: LoginRegisterResponseDataSource) => {
          this.notificationsService.sendPositive('Registration successful!');
          this.registrationSuccessful = true;
          this.loginService.setActiveUser(response);
        })
        .catch((err: HttpErrorResponse) => {
          this.loginService.handleLoginOrRegistrationErrorNotification(err.error);
          this.awaitingResponse = false;
        });
    }
  }

  public handleReturnToLogin(): void {
    this.dialogService.dialog.closeAll();
    setTimeout(() => {
      this.dialogService.openLoginDialog();
    }, 100);
  }

  public getErrorMessage(): string {
    if (this.registerForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.registerForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  public createCompareValidator(controlA: AbstractControl, controlB: AbstractControl): ValidatorFn {
    return () => {
      if (controlA.value !== controlB.value) return { match_error: 'Value does not match' };
      return null;
    };
  }
}
