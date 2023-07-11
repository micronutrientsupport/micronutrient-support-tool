import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';

export class UserRegister extends Endpoint<
  LoginRegisterResponseDataSource,
  UserRegistrationParams,
  LoginRegisterResponseDataSource
> {
  protected callLive(params: UserRegistrationParams): Promise<LoginRegisterResponseDataSource> {
    const callResponsePromise = this.apiCaller.doCall(['user', 'register'], RequestMethod.POST, null, {
      username: params.username,
      password: params.password,
      email: params.email,
      name: params.name,
      organisation: params.organisation,
    });
    return this.buildObjectFromResponse(LoginRegisterResponseDataSource, callResponsePromise);
  }
  protected callMock(): Promise<LoginRegisterResponseDataSource> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(LoginRegisterResponseDataSource, promise);
  }
}

export interface UserRegistrationParams {
  username: string;
  password: string;
  email: string;
  name: string;
  organisation?: string;
}
