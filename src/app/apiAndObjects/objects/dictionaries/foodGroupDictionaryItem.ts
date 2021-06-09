import { Dictionary } from '../../_lib_code/objects/dictionary';
import { ObjectAccessor } from '../../_lib_code/objects/objectAccessor';
import { ObjectBuilder } from '../../_lib_code/objects/objectBuilder';
import { FoodDictionaryItem } from './foodDictionaryItem';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class FoodGroupDictionaryItem extends MapsDictionaryItem {
  public static readonly DESC_ATTRIBUTE: string = 'name';
  public static readonly KEYS = {
    FOOD_ITEMS: 'food_items',
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
              .then((foodItems) =>
                new this(
                  source,
                  ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
                  ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
                  ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
                ).setFoodItems(foodItems),
              );
          }),
    );
  }
  public static createMockItems(groupsCount = 5, itemsCount = 5): Array<Record<string, unknown>> {
    const groups = new Array<Record<string, unknown>>();
    for (let i = 0; i < groupsCount; i++) {
      const group = {
        id: i,
        name: `group ${i}`,
      };
      const items = new Array<Record<string, unknown>>();
      for (let j = 0; j < itemsCount; j++) {
        items.push({
          id: `${i}-${j}`,
          name: `item ${i}-${j}`,
        });
      }
      group[FoodGroupDictionaryItem.KEYS.FOOD_ITEMS] = items;
      groups.push(group);
    }
    return groups;
  }

  protected setFoodItems(items: Array<FoodDictionaryItem>): this {
    this.foodItems.setItems(items);
    return this;
  }
}
