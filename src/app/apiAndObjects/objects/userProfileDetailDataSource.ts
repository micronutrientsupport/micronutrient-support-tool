import { BaseObject } from '../_lib_code/objects/baseObject';

export class UserProfileDetailDataSource extends BaseObject {
  public static readonly KEYS = {
    BADGES: 'badges',
    EMAIL: 'email',
    ID: 'id',
    NAME: 'name',
    ORGANISATION: 'organisation',
    PROFILE_PIC: 'profilePic',
    REGISTRATION_DATE: 'registrationDate',
    UPDATED_DATE: 'updatedDate',
    USERNAME: 'username',
  };

  public readonly badges: Array<Badge>;
  public readonly email: string;
  public readonly id: string;
  public readonly name: string;
  public readonly organisation: string;
  public readonly profilePic: string;
  public readonly registrationDate: moment.Moment;
  public readonly updatedDate: moment.Moment;
  public readonly username: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.badges = this._getArray(UserProfileDetailDataSource.KEYS.BADGES);
    this.email = this._getString(UserProfileDetailDataSource.KEYS.EMAIL);
    this.id = this._getString(UserProfileDetailDataSource.KEYS.ID);
    this.name = this._getString(UserProfileDetailDataSource.KEYS.NAME);
    this.organisation = this._getString(UserProfileDetailDataSource.KEYS.ORGANISATION);
    this.profilePic = this._getString(UserProfileDetailDataSource.KEYS.PROFILE_PIC);
    this.registrationDate = this._getDate(UserProfileDetailDataSource.KEYS.REGISTRATION_DATE);
    this.updatedDate = this._getDate(UserProfileDetailDataSource.KEYS.UPDATED_DATE);
    this.username = this._getString(UserProfileDetailDataSource.KEYS.USERNAME);
  }
}

export interface Badge {
  description: string;
  image: string;
  title: string;
  url: string;
}
