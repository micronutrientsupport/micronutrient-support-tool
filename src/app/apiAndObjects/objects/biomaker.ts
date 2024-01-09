import { BaseObject } from '../_lib_code/objects/baseObject';

export class Biomarker extends BaseObject {
  public static readonly KEYS = {
    TOTAL_STATS: 'totalStats',
    AGGREGATED_STATS: 'aggregatedStats',
    AGGREGATED_OUTLIERS: 'aggregatedOutliers',
    AGGREGATED_THRESHOLDS: 'aggregatedThresholds',
  };

  public readonly totalStats: Array<unknown>;
  public readonly aggregatedStats: Array<unknown>;
  public readonly aggregatedOutliers: Array<unknown>;
  public readonly aggregatedThresholds: unknown;

  protected constructor(sourceObject?: Record<string, unknown>) {
    console.debug(sourceObject);
    super(sourceObject);

    this.totalStats = this._getArray(Biomarker.KEYS.TOTAL_STATS);
    this.aggregatedStats = this._getArray(Biomarker.KEYS.AGGREGATED_STATS);
    this.aggregatedOutliers = this._getArray(Biomarker.KEYS.AGGREGATED_OUTLIERS);
    this.aggregatedThresholds = this._getValue(Biomarker.KEYS.AGGREGATED_THRESHOLDS);
  }
}
