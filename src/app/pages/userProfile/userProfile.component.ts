import { Component } from '@angular/core';
import { ApiService } from 'src/app/apiAndObjects/api/api.service';
import { UserProfileDetailDataSource } from 'src/app/apiAndObjects/objects/userProfileDetailDataSource';
import { UserLoginService } from 'src/app/services/userLogin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.scss'],
})
export class UserProfileComponent {
  public userProfile: UserProfileDetailDataSource;
  constructor(private userLoginService: UserLoginService, private apiService: ApiService) {
    this.apiService.endpoints.user.getProfile
      .call(this.userLoginService.getActiveUser())
      .then((response: UserProfileDetailDataSource) => {
        this.userProfile = response;
      });
  }
}
