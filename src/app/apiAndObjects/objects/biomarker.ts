import { BaseObject } from '../_lib_code/objects/baseObject';
import { AggregatedOutliers } from './biomarker/aggregatedOutliers';
import { AggregatedStats } from './biomarker/aggregatedStat';
import { AggregatedThresholds } from './biomarker/aggregatedThresholds';
import { BinnedValues } from './biomarker/binnedValues';
import { BiomarkerThresholdList } from './biomarker/biomarkerThresholds';
import { TotalStats } from './biomarker/totalStats';

export class Biomarker extends BaseObject {
  public static readonly KEYS = {
    TOTAL_STATS: 'totalStats',
    TOTAL_THRESHOLDS: 'totalThresholds',
    AGGREGATED_STATS: 'aggregatedStats',
    AGGREGATED_OUTLIERS: 'aggregatedOutliers',
    AGGREGATED_THRESHOLDS: 'aggregatedThresholds',
    BINNED_VALUES: 'binnedValues',
    THRESHOLDS: 'thresholds',
  };

  public readonly totalStats: Array<TotalStats>;
  public readonly totalThresholds: AggregatedThresholds;
  public readonly aggregatedStats: Array<AggregatedStats>;
  public readonly aggregatedOutliers: Array<AggregatedOutliers>;
  public readonly aggregatedThresholds: AggregatedThresholds;
  public readonly binnedValues: BinnedValues;
  public readonly thresholds: BiomarkerThresholdList;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.totalStats = this._getArray(Biomarker.KEYS.TOTAL_STATS);
    this.totalThresholds = this._getValue(Biomarker.KEYS.TOTAL_THRESHOLDS) as AggregatedThresholds;
    this.aggregatedStats = this._getArray(Biomarker.KEYS.AGGREGATED_STATS);
    this.aggregatedOutliers = this._getArray(Biomarker.KEYS.AGGREGATED_OUTLIERS);
    this.aggregatedThresholds = this._getValue(Biomarker.KEYS.AGGREGATED_THRESHOLDS) as AggregatedThresholds;
    this.binnedValues = this._getValue(Biomarker.KEYS.BINNED_VALUES) as BinnedValues;
    this.thresholds = this._getValue(Biomarker.KEYS.THRESHOLDS) as BiomarkerThresholdList;
  }
}
