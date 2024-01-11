import { BaseObject } from '../../_lib_code/objects/baseObject';

export class AggregatedStats extends BaseObject {
  public static readonly KEYS = {
    AGGREGATION: 'aggregation',
    LOWER_OUTLIER: 'lowerOutlier',
    LOWER_QUARTILE: 'lowerQuartile',
    MEAN: 'mean',
    MEDIAN: 'median',
    N: 'n',
    STANDARD_DEVIATION: 'standardDeviation',
    UPPER_OUTLIER: 'upperOutlier',
    UPPER_QUARTILE: 'upperQuartile',
  };

  public readonly aggregation: string;
  public readonly lowerOutlier: number;
  public readonly lowerQuartile: number;
  public readonly mean: number;
  public readonly median: number;
  public readonly n: number;
  public readonly standardDeviation: number;
  public readonly upperOutlier: number;
  public readonly upperQuartile: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.aggregation = this._getString(AggregatedStats.KEYS.AGGREGATION);
    this.lowerOutlier = this._getNumber(AggregatedStats.KEYS.LOWER_OUTLIER);
    this.lowerQuartile = this._getNumber(AggregatedStats.KEYS.LOWER_QUARTILE);
    this.mean = this._getNumber(AggregatedStats.KEYS.MEAN);
    this.median = this._getNumber(AggregatedStats.KEYS.MEDIAN);
    this.n = this._getNumber(AggregatedStats.KEYS.N);
    this.standardDeviation = this._getNumber(AggregatedStats.KEYS.STANDARD_DEVIATION);
    this.upperOutlier = this._getNumber(AggregatedStats.KEYS.UPPER_OUTLIER);
    this.upperQuartile = this._getNumber(AggregatedStats.KEYS.UPPER_QUARTILE);
  }
}
