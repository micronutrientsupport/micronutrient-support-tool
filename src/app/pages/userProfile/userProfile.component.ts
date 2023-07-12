import { Component } from '@angular/core';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { UserLoginService } from 'src/app/services/userLogin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.scss'],
})
export class UserProfileComponent {
  constructor(private userLoginService: UserLoginService, private apiService: ApiService) {
    this.apiService.endpoints.user.getProfile.call(this.userLoginService.getActiveUser()).then((response) => {
      console.debug(response);
    });
  }
}
