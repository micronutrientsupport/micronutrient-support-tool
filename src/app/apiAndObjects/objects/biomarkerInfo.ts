import { BaseObject } from '../_lib_code/objects/baseObject';

export interface BinValue {
  bin: number;
  frequency: number;
}

export class biomarkerInfo extends BaseObject {
  public static readonly KEYS = {
    AGE_GROUP: 'ageGenderGroup',
    DATA: 'data',
  };

  public readonly adequacyThreshold: number;
  public readonly data: Array<BinValue>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.adequacyThreshold = this._getNumber(biomarkerInfo.KEYS.AGE_GROUP);
    this.data = this._getArray(biomarkerInfo.KEYS.DATA);
  }
}
