import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class AgeGenderDictionaryItem extends MapsDictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'groupId';
  public static readonly NAME_ATTRIBUTE: string = 'groupName';
  public static readonly DESC_ATTRIBUTE: string = 'groupName';
  public static readonly KEYS = {
    GROUP: 'supraGroup',
  };

  public readonly group: string;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
    super(sourceObject, id, name, description);

    this.group = this._getString(AgeGenderDictionaryItem.KEYS.GROUP);
  }

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/age-gender-groups.json').toPromise() as Promise<
      Array<Record<string, unknown>>
    >;
  }
}
