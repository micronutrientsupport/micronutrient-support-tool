import { HttpHeaders } from '@angular/common/http';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { BaseObject } from '../../_lib_code/objects/baseObject';

export class UserLogout extends Endpoint<LogoutResponse, null, LogoutResponse> {
  protected callLive(): Promise<LogoutResponse> {
    const sessionToken = localStorage.getItem('X-Session-Token');
    const headers = (): HttpHeaders => {
      let authHeader = new HttpHeaders();
      authHeader = authHeader.append('X-Session-Token', sessionToken ? `X-Session-Token ${sessionToken}` : '');
      return authHeader;
    };
    const callResponsePromise = this.apiCaller.doCall(['user', 'logout'], RequestMethod.POST, null, {}, headers);
    return this.buildObjectFromResponse(LogoutResponse, callResponsePromise);
  }
  protected callMock(): Promise<LogoutResponse> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(LogoutResponse, promise);
  }
}

export class LogoutResponse extends BaseObject {
  public readonly success: boolean;
}
