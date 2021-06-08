import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export interface BinValue {
  bin: number;
  frequency: number;
}

export class HouseholdHistogramData extends BaseObject implements Exportable {
  public static readonly KEYS = {
    ADEQUACY_THRESHOLD: 'adequacy_threshold',
    DATA: 'data',
  };

  public readonly adequacyThreshold: number;
  public readonly data: Array<BinValue>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.adequacyThreshold = this._getNumber(HouseholdHistogramData.KEYS.ADEQUACY_THRESHOLD);
    this.data = this._getArray(HouseholdHistogramData.KEYS.DATA);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this.data)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    exportObject.adequacyThreshold = this.adequacyThreshold;
    return exportObject;
  }
  public getExportFileName(): string {
    return 'HouseholdDietarySupplyData';
  }
}
