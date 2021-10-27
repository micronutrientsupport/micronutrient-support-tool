import { CurrentComposition } from './currentComposition';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public foodGroup: FoodGroupDictionaryItem;
  public updatingCurrent = false;
  public updatingScenario = false;

  public readonly isComplete: boolean;

  constructor(public readonly foodItem: FoodDictionaryItem, public scenarioValue: T, public readonly noData = false) {
    this.foodGroup = foodItem?.group;
    this.isComplete = null != scenarioValue;
  }
}

export class NumberChangeItem extends DietaryChangeItem<number> {
  constructor(
    foodItem: FoodDictionaryItem = null,
    public readonly currentValue: number = null,
    scenarioValue: number = null,
    noData = false,
  ) {
    super(foodItem, scenarioValue, noData);
  }
}

export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {
  public scenarioFoodItemGroup: FoodGroupDictionaryItem;

  constructor(
    foodItem: FoodDictionaryItem = null,
    public readonly currentComposition: CurrentComposition = null,
    scenarioValue: FoodDictionaryItem = null,
    public readonly scenarioComposition: CurrentComposition = null,
  ) {
    super(foodItem, scenarioValue);
    this.scenarioFoodItemGroup = scenarioValue?.group;
  }
}
