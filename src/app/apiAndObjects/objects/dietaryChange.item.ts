import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  constructor(
    public readonly foodItem?: FoodDictionaryItem,
    public readonly currentValue?: T,
    public scenarioValue?: T,
  ) {}

  public isUseable(): boolean {
    return null != this.foodItem && null != this.scenarioValue;
  }
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {}
