import { CurrentComposition } from './currentComposition';
import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public foodItem: FoodDictionaryItem;
  public currentValue: T;
  public scenarioValue: T;

  public currentComposition: CurrentComposition;
  public scenarioComposition: CurrentComposition;

  public isUseable(): boolean {
    return null != this.foodItem && null != this.scenarioValue;
  }

  public clear(): void {
    this.foodItem = null;
    this.currentValue = null;
    this.scenarioValue = null;
    this.currentComposition = null;
    this.scenarioComposition = null;
  }
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {}
