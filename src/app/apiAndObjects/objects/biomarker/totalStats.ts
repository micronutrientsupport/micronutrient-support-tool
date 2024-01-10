import { BaseObject } from '../../_lib_code/objects/baseObject';

export class TotalStats extends BaseObject {
  public static readonly KEYS = {
    N_A_S: 'NaS',
    LOWER_OUTLIER: 'lowerOutlier',
    LOWER_QUARTILE: 'lowerQuartile',
    MAXIMUM: 'maximum',
    MEAN: 'mean',
    MEDIAN: 'median',
    MINIMUM: 'minimum',
    N: 'n',
    STANDARD_DEVIATION: 'standardDeviation',
    UPPER_OUTLIER: 'upperOutlier',
    UPPER_QUARTILE: 'upperQuartile',
  };

  public readonly NaS: number;
  public readonly lowerOutlier: number;
  public readonly lowerQuartile: number;
  public readonly maximum: number;
  public readonly mean: number;
  public readonly median: number;
  public readonly minimum: number;
  public readonly n: number;
  public readonly standardDeviation: number;
  public readonly upperOutlier: number;
  public readonly upperQuartile: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.NaS = this._getNumber(TotalStats.KEYS.N_A_S);
    this.lowerOutlier = this._getNumber(TotalStats.KEYS.LOWER_OUTLIER);
    this.lowerQuartile = this._getNumber(TotalStats.KEYS.LOWER_QUARTILE);
    this.maximum = this._getNumber(TotalStats.KEYS.MAXIMUM);
    this.mean = this._getNumber(TotalStats.KEYS.MEAN);
    this.median = this._getNumber(TotalStats.KEYS.MEDIAN);
    this.minimum = this._getNumber(TotalStats.KEYS.MINIMUM);
    this.n = this._getNumber(TotalStats.KEYS.N);
    this.standardDeviation = this._getNumber(TotalStats.KEYS.STANDARD_DEVIATION);
    this.upperOutlier = this._getNumber(TotalStats.KEYS.UPPER_OUTLIER);
    this.upperQuartile = this._getNumber(TotalStats.KEYS.UPPER_QUARTILE);
  }
}
