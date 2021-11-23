import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class UnmatchedTotals extends BaseObject implements Exportable {
  public static readonly KEYS = {
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_DATA_ID: 'compositionDataId',
    CONSUMPTION_TOTAL_COUNT: 'consumptionTotalItems',
    CONSUMPTION_UNMATCHED_COUNT: 'consumptionUnmatchedCount',
    CONSUMPTION_UNMATCHED_COUNT_PERC: 'consumptionUnmatchedCountPercentage',
    CONSUMPTION_TOTAL_WEIGHT: 'consumptionTotalWeight',
    CONSUMPTION_UNMATCHED_WEIGHT: 'consumptionUnmatchedWeight',
    CONSUMPTION_UNMATCHED_WEIGHT_PERC: 'consumptionUnmatchedWeightPercentage',
  };

  public readonly totalCount: number;
  public readonly unmatchedCount: number;
  public readonly unmatchedCountPerc: number;

  public readonly totalWeight: number;
  public readonly unmatchedWeight: number;
  public readonly unmatchedWeightPerc: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.totalCount = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_TOTAL_COUNT);
    this.unmatchedCount = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_UNMATCHED_COUNT);
    this.unmatchedCountPerc = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_UNMATCHED_COUNT_PERC);

    this.totalWeight = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_TOTAL_WEIGHT);
    this.unmatchedWeight = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_UNMATCHED_WEIGHT);
    this.unmatchedWeightPerc = this._getNumber(UnmatchedTotals.KEYS.CONSUMPTION_UNMATCHED_WEIGHT_PERC);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'UnmatchedTotals';
  }
}
