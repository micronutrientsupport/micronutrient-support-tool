import { BaseObject } from '../_lib_code/objects/baseObject';
import { AggregatedOutliers } from './biomarkerObjects/aggregatedOutliers';
import { AggregatedStats } from './biomarkerObjects/aggregatedStats';
import { AggregatedThresholds } from './biomarkerObjects/aggregatedThresholds';
import { TotalStats } from './biomarkerObjects/totalStats';

export class Biomarker extends BaseObject {
  public static readonly KEYS = {
    TOTAL_STATS: 'totalStats',
    AGGREGATED_STATS: 'aggregatedStats',
    AGGREGATED_OUTLIERS: 'aggregatedOutliers',
    AGGREGATED_THRESHOLDS: 'aggregatedThresholds',
  };

  public readonly totalStats: Array<TotalStats>;
  public readonly aggregatedStats: Array<AggregatedStats>;
  public readonly aggregatedOutliers: Array<AggregatedOutliers>;
  public readonly aggregatedThresholds: AggregatedThresholds;

  protected constructor(sourceObject?: Record<string, unknown>) {
    console.debug(sourceObject);
    super(sourceObject);

    this.totalStats = this._getArray(Biomarker.KEYS.TOTAL_STATS);
    this.aggregatedStats = this._getArray(Biomarker.KEYS.AGGREGATED_STATS);
    this.aggregatedOutliers = this._getArray(Biomarker.KEYS.AGGREGATED_OUTLIERS);
    this.aggregatedThresholds = this._getValue(Biomarker.KEYS.AGGREGATED_THRESHOLDS) as AggregatedThresholds;
  }
}
