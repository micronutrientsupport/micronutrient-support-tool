import { BaseObject } from '../../_lib_code/objects/baseObject';

export class BinnedValues extends BaseObject {
  public static readonly KEYS = {
    BIN_LABEL: 'binLabel',
    BIN_DATA: 'binData',
    BIN_SIZE: 'binSize',
  };

  public readonly binLabel: Array<number>;
  public readonly binData: Array<number>;
  public readonly binSize: Array<number>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    console.log('Build a bin val');
    this.binLabel = this._getArray(BinnedValues.KEYS.BIN_LABEL);
    this.binData = this._getArray(BinnedValues.KEYS.BIN_DATA);
    this.binSize = this._getArray(BinnedValues.KEYS.BIN_SIZE) as number[];
  }
}
