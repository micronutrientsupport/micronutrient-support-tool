import { FoodGroupDictionaryItem } from './foodGroupDictionaryItem';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class FoodDictionaryItem extends MapsDictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'foodGenusId';
  public static readonly NAME_ATTRIBUTE: string = 'foodGenusName';
  public static readonly DESC_ATTRIBUTE: string = 'foodGenusName';

  public group: FoodGroupDictionaryItem;

  public setGroup(group: FoodGroupDictionaryItem): this {
    this.group = group;
    return this;
  }
}
