import { CurrentComposition } from './currentComposition';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public foodGroup: FoodGroupDictionaryItem;
  public foodItem: FoodDictionaryItem;
  public currentValue: T; // not used for FoodItemChangeItem
  public scenarioValue: T;
  public updatingScenarioValue = false;

  public updatingComposition = false;
  public updatingScenarioComposition = false;

  // only used in FoodItemChangeItem.  I know that's not great but breaks in the template if not here.
  // Will try to make that better.
  public currentComposition: CurrentComposition;
  public scenarioComposition: CurrentComposition;
  public scenarioFoodItemGroup: FoodGroupDictionaryItem;

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
    this.scenarioFoodItemGroup = null;
    this.updatingScenarioValue = false;
    this.updatingComposition = false;
    this.updatingScenarioComposition = false;
  }
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {}
