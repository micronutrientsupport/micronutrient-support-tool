import { CurrentComposition } from './currentComposition';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public foodGroup: FoodGroupDictionaryItem;
  public foodItem: FoodDictionaryItem;
  public currentValue: T;
  public scenarioValue: T;

  public updating = false;
  public updatingScenario = false;

  // only used in FoodItemChangeItem.  I know that's not great. Will try to make that better.
  public currentComposition: CurrentComposition;
  public scenarioComposition: CurrentComposition;
  public currentValueFoodItemGroup: FoodGroupDictionaryItem;

  public isUseable(): boolean {
    return null != this.foodItem && null != this.scenarioValue;
  }

  public clear(): void {
    this.foodGroup = null;
    this.foodItem = null;
    this.currentValue = null;
    this.scenarioValue = null;
    this.currentComposition = null;
    this.scenarioComposition = null;
    this.currentValueFoodItemGroup = null;
    this.updating = false;
    this.updatingScenario = false;
  }
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {}
