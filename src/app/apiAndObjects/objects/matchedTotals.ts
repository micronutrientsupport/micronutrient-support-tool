import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class MatchedTotals extends BaseObject implements Exportable {
  public static readonly KEYS = {
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_LIST_ID: 'compositionListId',
    COMPOSITION_SOURCE_ID: 'compositionSourceId',
    COMPOSITION_SOURCE_NAME: 'compositionSourceName',
    CONSUMPTION_TOTAL_COUNT: 'consumptionTotalCount',
    CONSUMPTION_MATCHED_COUNT: 'consumptionMatchedCount',
    CONSUMPTION_MATCHED_COUNT_PERC: 'consumptionMatchedCountPercentage',
    CONSUMPTION_TOTAL_WEIGHT: 'consumptionTotalWeight',
    CONSUMPTION_MATCHED_WEIGHT: 'consumptionMatchedWeight',
    CONSUMPTION_MATCHED_WEIGHT_PERC: 'consumptionMatchedWeightPercentage',
  };

  public readonly totalCount: number;
  public readonly matchedCount: number;
  public readonly matchedCountPerc: number;
  public readonly matchedFctName: string;

  public readonly totalWeight: number;
  public readonly matchedWeight: number;
  public readonly matchedWeightPerc: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.totalCount = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_TOTAL_COUNT);
    this.matchedCount = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_MATCHED_COUNT);
    this.matchedCountPerc = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_MATCHED_COUNT_PERC);
    this.matchedFctName = this._getString(MatchedTotals.KEYS.COMPOSITION_SOURCE_NAME);

    this.totalWeight = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_TOTAL_WEIGHT);
    this.matchedWeight = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_MATCHED_WEIGHT);
    this.matchedWeightPerc = this._getNumber(MatchedTotals.KEYS.CONSUMPTION_MATCHED_WEIGHT_PERC);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'MatchedTotals';
  }
}
