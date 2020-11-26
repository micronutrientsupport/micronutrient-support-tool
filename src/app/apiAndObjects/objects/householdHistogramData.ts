import { BaseObject } from '../_lib_code/objects/baseObject';

export interface BinValue{
  bin: number;
  frequency: number;
}

export class HouseholdHistogramData extends BaseObject {
  public static readonly KEYS = {
    ADEQUACY_THRESHOLD: 'adequacy_threshold',
    DATA: 'data',
  };

  public adequacyThreshold: string;
  public data: Array<BinValue>;

  public static makeItemFromObject(source: Record<string, unknown>): HouseholdHistogramData {
    return super.makeItemFromObject(source) as HouseholdHistogramData;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.adequacyThreshold = this._getString(HouseholdHistogramData.KEYS.ADEQUACY_THRESHOLD);
    this.data = this._getArray(HouseholdHistogramData.KEYS.DATA);
  }
}
