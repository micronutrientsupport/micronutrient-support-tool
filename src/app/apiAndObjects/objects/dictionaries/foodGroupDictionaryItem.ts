import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Dictionary } from '../../_lib_code/objects/dictionary';
import { ObjectAccessor } from '../../_lib_code/objects/objectAccessor';
import { ObjectBuilder } from '../../_lib_code/objects/objectBuilder';
import { FoodDictionaryItem } from './foodDictionaryItem';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class FoodGroupDictionaryItem extends MapsDictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'foodGroupId';
  public static readonly NAME_ATTRIBUTE: string = 'foodGroupName';
  public static readonly DESC_ATTRIBUTE: string = 'foodGroupName';
  public static readonly KEYS = {
    FOOD_ITEMS: 'foodItems',
  };

  // dictionary class used for sub items
  public readonly foodItems = new Dictionary(null);

  // overrides default construction method
  public static constructObject(source?: Record<string, unknown>): Promise<FoodGroupDictionaryItem> {
    return Promise.resolve(
      !this.validateObject(source)
        ? null
        : ObjectBuilder.instance.then((objectBuilder: ObjectBuilder) => {
            const foodItemObjects = ObjectAccessor.getValue(FoodGroupDictionaryItem.KEYS.FOOD_ITEMS, source) as Array<
              Record<string, unknown>
            >;
            return objectBuilder
              .buildArray<FoodDictionaryItem>(FoodDictionaryItem, foodItemObjects)
              .then((foodItems) => {
                const group = new this(
                  source,
                  ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
                  ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
                  ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
                ).setFoodItems(foodItems);
                foodItems.forEach((item) => item.setGroup(group));
                return group;
              });
          }),
    );
  }

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/food_groups.json').toPromise() as Promise<
      Array<Record<string, unknown>>
    >;
  }

  protected setFoodItems(items: Array<FoodDictionaryItem>): this {
    this.foodItems.setItems(items);
    return this;
  }
}
