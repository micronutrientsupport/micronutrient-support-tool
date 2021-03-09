import { BaseObject } from '../_lib_code/objects/baseObject';

export interface BinValue {
  bin: number;
  frequency: number;
}

export class HouseholdHistogramData extends BaseObject {
  public static readonly KEYS = {
    ADEQUACY_THRESHOLD: 'adequacy_threshold',
    DATA: 'data',
  };

  public readonly adequacyThreshold: number;
  public readonly data: Array<BinValue>;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.adequacyThreshold = this._getNumber(HouseholdHistogramData.KEYS.ADEQUACY_THRESHOLD);
    this.data = this._getArray(HouseholdHistogramData.KEYS.DATA);
  }
}
