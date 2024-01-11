import { BaseObject } from '../../_lib_code/objects/baseObject';

export class AggregatedThresholds extends BaseObject {
  public static readonly KEYS = {
    DEFICIENCY_1: 'deficiency1',
    EXCESS_1: 'excess1',
    EXCESS_2: 'excess2',
  };

  public readonly deficiency1: Array<unknown>;
  public readonly excess1: Array<unknown>;
  public readonly excess2: Array<unknown>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.deficiency1 = this._getArray(AggregatedThresholds.KEYS.DEFICIENCY_1);
    this.excess1 = this._getArray(AggregatedThresholds.KEYS.EXCESS_1);
    this.excess2 = this._getArray(AggregatedThresholds.KEYS.EXCESS_2);
  }
}
