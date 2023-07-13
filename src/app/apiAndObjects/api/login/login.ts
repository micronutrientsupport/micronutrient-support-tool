import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';

export class UserLogin extends Endpoint<
  LoginRegisterResponseDataSource,
  UserLoginParams,
  LoginRegisterResponseDataSource
> {
  protected callLive(params: UserLoginParams): Promise<LoginRegisterResponseDataSource> {
    const callResponsePromise = this.apiCaller.doCall(['user', 'login'], RequestMethod.POST, null, {
      username: params.username,
      password: params.password,
    });
    return this.buildObjectFromResponse(LoginRegisterResponseDataSource, callResponsePromise);
  }
  protected callMock(): Promise<LoginRegisterResponseDataSource> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(LoginRegisterResponseDataSource, promise);
  }
}

export interface UserLoginParams {
  username: string;
  password: string;
}
