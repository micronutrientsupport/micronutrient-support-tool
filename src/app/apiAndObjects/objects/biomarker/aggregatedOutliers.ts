import { BaseObject } from '../../_lib_code/objects/baseObject';

export class AggregatedOutliers extends BaseObject {
  public static readonly KEYS = {
    AGGREGATION: 'aggregation',
    MEASUREMENT: 'measurement',
  };

  public readonly aggregation: string;
  public readonly measurement: Array<number>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.aggregation = this._getString(AggregatedOutliers.KEYS.AGGREGATION);
    this.measurement = this._getArray(AggregatedOutliers.KEYS.MEASUREMENT);
  }
}
