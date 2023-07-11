import { Injectable } from '@angular/core';
import { RegisterLoginResponseError } from '../apiAndObjects/objects/registerLoginResponseError';
import { NotificationsService } from '../components/notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  constructor(private notificationSevice: NotificationsService) {}

  public handleLoginOrRegistrationErrorNotification(err: RegisterLoginResponseError): void {
    console.debug(err);
    switch (err.msg) {
      case RegisterLoginResponseErrorMessage.INVALID_CREDENTIALS: {
        this.notificationSevice.sendNegative('Invalid username or password, please try again.', null, 8000);
        break;
      }
      case RegisterLoginResponseErrorMessage.PRE_EXISTING_EMAIL: {
        this.notificationSevice.sendInformative('An account already exists with this email.', null, 8000);
        break;
      }
      case RegisterLoginResponseErrorMessage.PRE_EXISTING_USERNAME: {
        this.notificationSevice.sendInformative('An account already exists with this username.', null, 8000);
        break;
      }
    }
  }
}

enum RegisterLoginResponseErrorMessage {
  INVALID_CREDENTIALS = 'Invalid username/password.',
  PRE_EXISTING_EMAIL = 'Account already exists for this email address.',
  PRE_EXISTING_USERNAME = 'Account already exists for this username.',
}
