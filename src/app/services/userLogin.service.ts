import { Injectable } from '@angular/core';
import { RegisterLoginResponseError } from '../apiAndObjects/objects/registerLoginResponseError';
import { NotificationsService } from '../components/notifications/notification.service';
import { BehaviorSubject } from 'rxjs';
import { LoginRegisterResponseDataSource } from '../apiAndObjects/objects/loginRegisterResponseDataSource';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  /**
   * Local Storage Key
   */
  public readonly ACTIVE_USER = 'activeUser';

  private activeUserSubject = new BehaviorSubject<LoginRegisterResponseDataSource | null>(null);
  public activeUserObs = this.activeUserSubject.asObservable();

  constructor(private notificationSevice: NotificationsService) {}

  /**
   * Sets active user
   */
  public setActiveUser(simpleUserDetails: LoginRegisterResponseDataSource) {
    localStorage.setItem(this.ACTIVE_USER, JSON.stringify(simpleUserDetails));
    this.activeUserSubject.next(simpleUserDetails);
  }

  /**
   * Gets active user
   */
  public getActiveUser(): LoginRegisterResponseDataSource | null {
    return this.activeUserSubject.getValue();
  }

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
