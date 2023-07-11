import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { NotificationsService } from '../../notifications/notification.service';
import { DialogData } from '../baseDialogService.abstract';
import { UserRegistrationParams } from 'src/app/apiAndObjects/api/login/register';

@Component({
  selector: 'app-user-register-dialog',
  templateUrl: './userRegisterDialog.component.html',
  styleUrls: ['./userRegisterDialog.component.scss'],
})
export class UserRegisterDialogComponent implements OnInit {
  public title = 'Please Register';
  public hidePw = true;
  public hideRepeatPw = true;
  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    organisation: new FormControl('', [Validators.required]),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<unknown>,
    private apiService: ApiService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.registerForm.addValidators([
      this.createCompareValidator(this.registerForm.get('password'), this.registerForm.get('repeatPassword')),
    ]);
    this.registerForm.valueChanges.subscribe((changes) => {
      console.debug(this.registerForm);
    });
  }

  public handleSubmit(): void {
    if (this.registerForm.valid) {
      const regParams: UserRegistrationParams = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        name: this.registerForm.value.name,
        organisation: this.registerForm.value.organisation,
      };
      this.apiService.endpoints.login.register
        .call(regParams)
        .then((response: unknown) => {
          this.notificationsService.sendPositive('Registered!');
          console.log(response);
        })
        .catch((err) => {
          this.notificationsService.sendNegative('Unable to register', err);
        });
    }
  }

  public getErrorMessage(): string {
    if (this.registerForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.registerForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  public createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value) return { match_error: 'Value does not match' };
      return null;
    };
  }
}
