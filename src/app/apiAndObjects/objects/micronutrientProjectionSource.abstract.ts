import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export abstract class MicronutrientProjectionSource extends BaseObject implements Exportable {
  public static readonly KEYS = {
    NUTRIENT: 'nutrient',
    COUNTRY: 'country',
    SCENARIO: 'scenario',
    YEAR: 'year',
    VALUE: 'value',
    RANK: 'rank',
  };

  public readonly nutrient: string;
  public readonly country: string;
  public readonly scenario: string;
  public readonly year: number;
  public readonly value: number;
  public readonly rank: number;

  public abstract name: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.nutrient = this._getString(MicronutrientProjectionSource.KEYS.NUTRIENT);
    this.country = this._getString(MicronutrientProjectionSource.KEYS.COUNTRY);
    this.scenario = this._getString(MicronutrientProjectionSource.KEYS.SCENARIO);
    this.year = this._getNumber(MicronutrientProjectionSource.KEYS.YEAR);
    this.value = this._getNumber(MicronutrientProjectionSource.KEYS.VALUE);
    this.rank = this._getNumber(MicronutrientProjectionSource.KEYS.RANK);
  }

  public getExportFileName(): string {
    return 'ProjectionFoodSourcesData';
  }
  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
}
