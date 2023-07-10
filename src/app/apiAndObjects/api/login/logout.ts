import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { BaseObject } from '../../_lib_code/objects/baseObject';

export class UserLogout extends Endpoint<LogoutResponse, null, LogoutResponse> {
  protected callLive(): Promise<LogoutResponse> {
    const callResponsePromise = this.apiCaller.doCall(['user', 'logout'], RequestMethod.POST, null, {});
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
