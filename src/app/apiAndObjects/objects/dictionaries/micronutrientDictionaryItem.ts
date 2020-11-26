import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { MicronutrientType } from '../enums/micronutrientType.enum';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class MicronutrientDictionaryItem extends MapsDictionaryItem {
  public static readonly TYPE_ATTRIBUTE = 'type';

  public type: MicronutrientType;

  // public static createMockItems(count: number, type: DictionaryType): Array<Record<string, unknown>> {
  //   const types = [MicronutrientType.VITAMIN, MicronutrientType.MINERAL, MicronutrientType.OTHER];
  //   return super.createMockItems(count, type).map((item: Record<string, unknown>, index: number) => {
  //     item[this.TYPE_ATTRIBUTE] = types[index % types.length];
  //     return item;
  //   });
  // }
  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/mineral-vitamin-select.json').toPromise() as Promise<Array<Record<string, unknown>>>;
  }

  protected populateValues(): void {
    super.populateValues();
    this.type = this._getEnum(MicronutrientDictionaryItem.TYPE_ATTRIBUTE, MicronutrientType);
  }
}
