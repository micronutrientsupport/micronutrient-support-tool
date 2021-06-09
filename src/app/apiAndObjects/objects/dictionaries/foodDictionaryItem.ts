import { FoodGroupDictionaryItem } from './foodGroupDictionaryItem';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class FoodDictionaryItem extends MapsDictionaryItem {
  public static readonly DESC_ATTRIBUTE: string = 'name';

  public group: FoodGroupDictionaryItem;

  public setGroup(group: FoodGroupDictionaryItem): this {
    this.group = group;
    return this;
  }
}
