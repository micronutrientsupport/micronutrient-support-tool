import { CurrentComposition } from './currentComposition';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';
import { FoodGroupDictionaryItem } from './dictionaries/foodGroupDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public foodGroup: FoodGroupDictionaryItem;
  public foodItem: FoodDictionaryItem;
  public currentValue: T; // not used for FoodItemChangeItem
  public scenarioValue: T;
  public updatingCurrent = false;
  public updatingScenario = false;

  public noData = false;
  public isUseable = false;

  // only used in FoodItemChangeItem.  I know that's not great but breaks in the template if not here.
  // Will try to make that better.
  public currentComposition: CurrentComposition;
  public scenarioComposition: CurrentComposition;
  public scenarioFoodItemGroup: FoodGroupDictionaryItem;
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {}
