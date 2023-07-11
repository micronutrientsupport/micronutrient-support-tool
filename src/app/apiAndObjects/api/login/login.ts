import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { BaseObject } from '../../_lib_code/objects/baseObject';

export class UserLogin extends Endpoint<LoginResponse, UserLoginParams, LoginResponse> {
  protected callLive(params: UserLoginParams): Promise<LoginResponse> {
    const callResponsePromise = this.apiCaller.doCall(['user', 'login'], RequestMethod.POST, null, {
      username: params.username,
      password: params.password,
    });
    return this.buildObjectFromResponse(LoginResponse, callResponsePromise);
  }
  protected callMock(): Promise<LoginResponse> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(LoginResponse, promise);
  }
}

export interface UserLoginParams {
  username: string;
  password: string;
}

export class LoginResponse extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    PROFILE_PIC: 'profilePic',
    SESSION_TOKEN: 'sessionToken',
    USERNAME: 'username',
  };

  public readonly id: string;
  public readonly profilePic: string;
  public readonly sessionToken: string;
  public readonly username: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.id = this._getString(LoginResponse.KEYS.ID);
    this.profilePic = this._getString(LoginResponse.KEYS.PROFILE_PIC);
    this.sessionToken = this._getString(LoginResponse.KEYS.SESSION_TOKEN);
    this.sessionToken = this._getString(LoginResponse.KEYS.SESSION_TOKEN);
    this.username = this._getString(LoginResponse.KEYS.USERNAME);
  }
}
