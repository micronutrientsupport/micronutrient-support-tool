import { BaseObject } from '../_lib_code/objects/baseObject';
export interface ProjectedFoodSourcesPeriod {
  year: number;
  data: Array<ProjectedFoodSourceItem2>;
}

export interface ProjectedFoodSourceItem2 {
  foodName: string;
  value: number;
}
export interface ProjectedFoodSourceItem {
  cassava: number;
  maize: number;
  potato: number;
  vegetables: number;
  pigeonpeas: number;
  dairy: number;
  other: number;
}
export interface ProjectedFoodSourcesTable {
  year: number;
  foodName: string;
  value: number;
}
export class ProjectedFoodSourcesData extends BaseObject {
  public static readonly KEYS = {
    NUTRIENT: 'nutrient',
    COUNTRY: 'country',
    SCENARIO: 'scenario',
    COMMODITY: 'commodity',
    YEAR: 'year',
    VALUE: 'value',
    RANK: 'rank',
  };

  public readonly nutrient: string;
  public readonly country: string;
  public readonly scenario: string;
  public readonly commodity: string;
  public readonly year: number;
  public readonly value: number;
  public readonly rank: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.nutrient = this._getString(ProjectedFoodSourcesData.KEYS.NUTRIENT);
    this.country = this._getString(ProjectedFoodSourcesData.KEYS.COUNTRY);
    this.scenario = this._getString(ProjectedFoodSourcesData.KEYS.SCENARIO);
    this.commodity = this._getString(ProjectedFoodSourcesData.KEYS.COMMODITY);
    this.year = this._getNumber(ProjectedFoodSourcesData.KEYS.YEAR);
    this.value = this._getNumber(ProjectedFoodSourcesData.KEYS.VALUE);
    this.rank = this._getNumber(ProjectedFoodSourcesData.KEYS.RANK);
  }
}
