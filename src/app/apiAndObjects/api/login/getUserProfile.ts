import { HttpHeaders } from '@angular/common/http';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';

export class GetUserProfile extends CacheableEndpoint<
  LoginRegisterResponseDataSource,
  void,
  LoginRegisterResponseDataSource
> {
  protected getCacheKey(): string {
    const params = '';
    return JSON.stringify(params);
  }

  protected callLive(): Promise<LoginRegisterResponseDataSource> {
    const sessionToken = 'r:482ae1b32e9511f4ce753989a5e56b25';
    const headers = (): HttpHeaders => {
      let authHeader = new HttpHeaders();
      authHeader = authHeader.append('X-Session-Token', sessionToken ? sessionToken : '');
      return authHeader;
    };
    const callResponsePromise = this.apiCaller.doCall(['user', 'profile'], RequestMethod.GET, null, {}, headers);
    return this.buildObjectFromResponse(LoginRegisterResponseDataSource, callResponsePromise);
  }

  protected callMock(): Promise<LoginRegisterResponseDataSource> {
    return null;
  }
}
