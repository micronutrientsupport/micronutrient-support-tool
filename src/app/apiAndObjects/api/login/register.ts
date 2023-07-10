import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { BaseObject } from '../../_lib_code/objects/baseObject';

export class UserRegister extends Endpoint<RegisterResponse, UserRegistrationParams, RegisterResponse> {
  protected callLive(params: UserRegistrationParams): Promise<RegisterResponse> {
    const callResponsePromise = this.apiCaller.doCall(['user', 'register'], RequestMethod.POST, null, {
      username: params.username,
      password: params.password,
      email: params.email,
      name: params.name,
      organisation: params.organisation,
    });
    return this.buildObjectFromResponse(RegisterResponse, callResponsePromise);
  }
  protected callMock(): Promise<RegisterResponse> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(RegisterResponse, promise);
  }
}

export interface UserRegistrationParams {
  username: string;
  password: string;
  email: string;
  name: string;
  organisation?: string;
}

export class RegisterResponse extends BaseObject {
  public readonly success: boolean;
}
