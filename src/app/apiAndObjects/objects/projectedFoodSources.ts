import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export interface ProjectedFoodSourcesTable {
  year: number;
  foodName: string;
  value: number;
}
export class ProjectedFoodSourcesData extends BaseObject implements Exportable {
  public static readonly KEYS = {
    NUTRIENT: 'nutrient',
    COUNTRY: 'country',
    SCENARIO: 'scenario',
    COMMODITY: 'commodity',
    FOODGROUP: 'foodGroup',
    YEAR: 'year',
    VALUE: 'value',
    RANK: 'rank',
  };

  public readonly nutrient: string;
  public readonly country: string;
  public readonly scenario: string;
  public readonly commodity: string;
  public readonly foodGroup: string;
  public readonly year: number;
  public readonly value: number;
  public readonly rank: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.nutrient = this._getString(ProjectedFoodSourcesData.KEYS.NUTRIENT);
    this.country = this._getString(ProjectedFoodSourcesData.KEYS.COUNTRY);
    this.scenario = this._getString(ProjectedFoodSourcesData.KEYS.SCENARIO);
    this.commodity = this._getString(ProjectedFoodSourcesData.KEYS.COMMODITY);
    this.foodGroup = this._getString(ProjectedFoodSourcesData.KEYS.FOODGROUP);
    this.year = this._getNumber(ProjectedFoodSourcesData.KEYS.YEAR);
    this.value = this._getNumber(ProjectedFoodSourcesData.KEYS.VALUE);
    this.rank = this._getNumber(ProjectedFoodSourcesData.KEYS.RANK);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'ProjectionFoodSourcesData';
  }
}
