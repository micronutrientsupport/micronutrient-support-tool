import { BaseObject } from '../../_lib_code/objects/baseObject';

export class BinnedValues extends BaseObject {
  public static readonly KEYS = {
    BIN_DATA: 'binData',
    BIN_LABEL: 'binLabel',
    BIN_SIZE: 'binSize',
  };

  public readonly binData: Array<number>;
  public readonly binLabel: Array<number>;
  public readonly binSize: Array<number>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.binData = this._getArray(BinnedValues.KEYS.BIN_DATA);
    this.binLabel = this._getArray(BinnedValues.KEYS.BIN_LABEL);
    this.binSize = this._getArray(BinnedValues.KEYS.BIN_SIZE);
  }
}
