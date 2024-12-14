import { BaseObject } from '../_lib_code/objects/baseObject';

export class InterventionStatus extends BaseObject {
  public static readonly KEYS = {
    FORTIFICATION_TYPE: 'fortificationType',
    STATUS: 'status',
    STATUS_NAME: 'statusName',
    STATUS_DESC: 'statusDesc',
    NATURE: 'nature',
    NATURE_NAME: 'natureName',
    NATURE_DESC: 'natureDesc',
    WHEN_TO_USE: 'whenToUse',
  };

  public readonly fortificationType: string;
  public readonly status: number;
  public readonly statusName: string;
  public readonly statusDesc: string;
  public readonly nature: number;
  public readonly natureName: string;
  public readonly natureDesc: string;
  public readonly whenToUse: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.fortificationType = this._getString(InterventionStatus.KEYS.FORTIFICATION_TYPE);
    this.status = this._getNumber(InterventionStatus.KEYS.STATUS);
    this.statusName = this._getString(InterventionStatus.KEYS.STATUS_NAME);
    this.statusDesc = this._getString(InterventionStatus.KEYS.STATUS_DESC);
    this.nature = this._getNumber(InterventionStatus.KEYS.NATURE);
    this.natureName = this._getString(InterventionStatus.KEYS.NATURE_NAME);
    this.natureDesc = this._getString(InterventionStatus.KEYS.NATURE_DESC);
    this.whenToUse = this._getString(InterventionStatus.KEYS.WHEN_TO_USE);
  }
}
