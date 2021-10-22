import { Injector } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { FoodDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/foodGroupDictionaryItem';
import {
  CompositionChangeItem,
  ConsumptionChangeItem,
  DietaryChangeItem,
  FoodItemChangeItem,
} from 'src/app/apiAndObjects/objects/dietaryChange.item';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DietaryChangeMode } from '../../pages/dietaryChange/dietaryChangeMode.enum';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';
import { Converter } from './converter.abstract';

export class DietaryChangeItemsConverter extends Converter<Array<DietaryChangeItem>> {
  constructor(queryStringkey: QuickMapsQueryParamKey) {
    super(queryStringkey);
  }

  public getString(): string {
    return this.item
      .filter((item) => item.isUseable())
      .map((item) =>
        item instanceof FoodItemChangeItem
          ? [item.foodItem.id, String(item.scenarioValue.id)].join('-')
          : [item.foodItem.id, String(item.scenarioValue)].join('-'),
      )
      .join(',');
  }
  public getItem(injector: Injector, dependencies: Promise<DietaryChangeMode>): Promise<Array<DietaryChangeItem>> {
    const dictionariesService = injector.get<DictionaryService>(DictionaryService);

    return Promise.all([dependencies, dictionariesService.getDictionary(DictionaryType.FOOD_GROUPS)]).then(
      (newDeps: [DietaryChangeMode, Dictionary]) => {
        const mode = newDeps.shift() as DietaryChangeMode;
        const foodGroupsDict = newDeps.shift() as Dictionary;
        const items = this.stringValue
          .split(',')
          .map((itemString) => {
            const foodItemId = itemString.split('-')[0];
            const scenarioValue = itemString.split('-')[1];

            let changeItem: DietaryChangeItem;
            switch (mode) {
              case DietaryChangeMode.COMPOSITION:
                changeItem = new CompositionChangeItem();
                changeItem.scenarioValue = Number(scenarioValue);
                break;
              case DietaryChangeMode.CONSUMPTION:
                changeItem = new ConsumptionChangeItem();
                changeItem.scenarioValue = Number(scenarioValue);
                break;
              case DietaryChangeMode.FOOD_ITEM:
                const item = new FoodItemChangeItem();
                item.scenarioValue = this.getFoodItemByIdFromDict(foodGroupsDict, scenarioValue);
                item.scenarioFoodItemGroup = item.scenarioValue?.group;
                changeItem = item;
                break;
            }
            if (null != changeItem) {
              changeItem.foodItem = this.getFoodItemByIdFromDict(foodGroupsDict, foodItemId);
              changeItem.foodGroup = changeItem.foodItem?.group;
            }
            return changeItem;
          })
          .filter((item) => null != item);

        return items;
      },
    );
  }

  private getFoodItemByIdFromDict(foodGroupDict: Dictionary, itemId: string): FoodDictionaryItem {
    // extract all the food items from the groups then return the one we want
    return new Array<FoodDictionaryItem>()
      .concat(
        ...foodGroupDict
          .getItems<FoodGroupDictionaryItem>()
          .map((groupItem: FoodGroupDictionaryItem) => groupItem.foodItems.getItems<FoodDictionaryItem>()),
      )
      .find((foodItem) => foodItem.id === itemId);
  }
}
