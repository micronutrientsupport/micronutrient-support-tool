import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { MicronutrientType } from '../enums/micronutrientType.enum';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class MicronutrientDictionaryItem extends MapsDictionaryItem {
  public static readonly KEYS = {
    TYPE: 'category',
    UNIT: 'unit',
    IS_IN_IMPACT: 'isInImpact',
    IS_BIOMARKER: 'isBiomarker',
    IS_DIET: 'isDiet',
  };

  public readonly type: MicronutrientType;
  public readonly unit: string;
  public readonly isInImpact: boolean;
  public readonly isBiomarker: boolean;
  public readonly isDiet: boolean;

  protected constructor(
    sourceObject: Record<string, unknown>,
    id: string,
    name: string,
    description: string,
  ) {
    super(sourceObject, id, name, description);

    this.type = this._getEnum(MicronutrientDictionaryItem.KEYS.TYPE, MicronutrientType);
    this.unit = this._getString(MicronutrientDictionaryItem.KEYS.UNIT);
    this.isInImpact = this._getBoolean(MicronutrientDictionaryItem.KEYS.IS_IN_IMPACT);
    this.isBiomarker = this._getBoolean(MicronutrientDictionaryItem.KEYS.IS_BIOMARKER);
    this.isDiet = this._getBoolean(MicronutrientDictionaryItem.KEYS.IS_DIET);
  }

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/mineral-vitamin-select.json').toPromise() as Promise<Array<Record<string, unknown>>>;
  }
}
