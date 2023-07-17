import { HttpHeaders } from '@angular/common/http';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { UserProfileDetailDataSource } from '../../objects/userProfileDetailDataSource';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';

export class GetUserProfile extends Endpoint<
  UserProfileDetailDataSource,
  LoginRegisterResponseDataSource,
  UserProfileDetailDataSource
> {
  protected callLive(activeUser: LoginRegisterResponseDataSource): Promise<UserProfileDetailDataSource> {
    const headers = (): HttpHeaders => {
      let authHeader = new HttpHeaders();
      authHeader = authHeader.append('X-Session-Token', activeUser ? activeUser.sessionToken : '');
      return authHeader;
    };
    const callResponsePromise = this.apiCaller.doCall(['user', 'profile'], RequestMethod.GET, null, {}, headers);
    return this.buildObjectFromResponse(UserProfileDetailDataSource, callResponsePromise);
  }

  protected callMock(): Promise<UserProfileDetailDataSource> {
    return null;
  }
}
