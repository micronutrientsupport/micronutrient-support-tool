import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class AgeGenderDictionaryItem extends MapsDictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'groupId';
  public static readonly NAME_ATTRIBUTE: string = 'groupName';
  public static readonly DESC_ATTRIBUTE: string = 'groupName';

  public static readonly GROUP_ID: string = 'groupId';
  public static readonly SUPRA_GROUP: string = 'supraGroup';
  public static readonly GROUP_NAME: string = 'groupName';
  public static readonly IS_DEFAULT: string = 'isDefault';
  public static readonly KEYS = {
    GROUP_ID: 'groupId',
    SUPRA_GROUP: 'supraGroup',
    GROUP_NAME: 'groupName',
    IS_DEFAULT: 'isDefault',
  };

  public readonly groupId: string;
  public readonly supraGroup: string;
  public readonly groupName: string;
  public readonly isDefault: boolean;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
    super(sourceObject, id, name, description);

    this.groupId = this._getString(AgeGenderDictionaryItem.KEYS.GROUP_ID);
    this.supraGroup = this._getString(AgeGenderDictionaryItem.KEYS.SUPRA_GROUP);
    this.groupName = this._getString(AgeGenderDictionaryItem.KEYS.GROUP_NAME);
    this.isDefault = this._getBoolean(AgeGenderDictionaryItem.KEYS.IS_DEFAULT);
  }

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return lastValueFrom(httpClient.get('/assets/exampleData/age-gender-groups.json')) as Promise<
      Array<Record<string, unknown>>
    >;
  }
}
