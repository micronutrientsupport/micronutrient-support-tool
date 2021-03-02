import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { MicronutrientType } from '../enums/micronutrientType.enum';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class MicronutrientDictionaryItem extends MapsDictionaryItem {
  public static readonly TYPE_ATTRIBUTE = 'type';

  public readonly type: MicronutrientType;

  protected constructor(
    sourceObject: Record<string, unknown>,
    id: string,
    name: string,
    description: string,
  ) {
    super(sourceObject, id, name, description);

    this.type = this._getEnum(MicronutrientDictionaryItem.TYPE_ATTRIBUTE, MicronutrientType);
  }

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/mineral-vitamin-select.json').toPromise() as Promise<Array<Record<string, unknown>>>;
  }
}
