// import { BaseObject } from '../_lib_code/objects/baseObject';

// export interface ProjectedFoodSourceItem {
//   nutrient: string;
//   country: string;
//   scenario: string;
//   commodity: string;
//   year: number;
//   value: number;
//   rank: number;
// }

// export class ProjectedFoodSourcesData extends BaseObject {
//   public static readonly KEYS = {
//     DATA: 'data',
//   };

//   public readonly data: Array<ProjectedFoodSourceItem>;

//   protected constructor(sourceObject?: Record<string, unknown>) {
//     super(sourceObject);

//     this.data = this._getArray(ProjectedFoodSourcesData.KEYS.DATA);
//   }
// }

export interface ProjectedFoodSourcesPeriod {
  year: number;
  data: ProjectedFoodSourceItem;
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

import { BaseObject } from '../_lib_code/objects/baseObject';

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
