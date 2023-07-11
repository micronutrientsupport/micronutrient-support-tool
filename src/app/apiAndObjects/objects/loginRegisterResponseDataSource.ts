import { BaseObject } from '../_lib_code/objects/baseObject';

export class LoginRegisterResponseDataSource extends BaseObject {
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

    this.id = this._getString(LoginRegisterResponseDataSource.KEYS.ID);
    this.profilePic = this._getString(LoginRegisterResponseDataSource.KEYS.PROFILE_PIC);
    this.sessionToken = this._getString(LoginRegisterResponseDataSource.KEYS.SESSION_TOKEN);
    this.username = this._getString(LoginRegisterResponseDataSource.KEYS.USERNAME);
  }
}
