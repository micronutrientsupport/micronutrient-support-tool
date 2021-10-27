import { DietaryChangeItem, FoodItemChangeItem } from 'src/app/apiAndObjects/objects/dietaryChangeItem';
import { DietaryChangeItemFactory } from 'src/app/apiAndObjects/objects/dietaryChangeItemFactory';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';
import { Converter } from './converter.abstract';

export class DietaryChangeItemsConverter extends Converter<Array<DietaryChangeItem>> {
  constructor(queryStringkey: QuickMapsQueryParamKey) {
    super(queryStringkey);
  }

  public getString(): string {
    return this.item
      .filter((item) => item.isComplete)
      .map((item) =>
        item instanceof FoodItemChangeItem
          ? [item.foodItem.id, String(item.scenarioValue.id)].join('-')
          : [item.foodItem.id, String(item.scenarioValue)].join('-'),
      )
      .join(',');
  }
  public getItem(dietaryChangeItemFactory: DietaryChangeItemFactory): Promise<Array<DietaryChangeItem>> {
    return Promise.all(
      (this.stringValue ?? '')
        .split(',')
        .map((thisString) => thisString.trim())
        .filter((thisString) => thisString.length > 0)
        .map((itemString) => {
          const foodItemId = itemString.split('-')[0];
          const scenarioValue = itemString.split('-')[1];

          return dietaryChangeItemFactory.makeItem(foodItemId, scenarioValue);
        }),
    );
  }
}
