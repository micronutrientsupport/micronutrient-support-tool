import { FoodDictionaryItem } from './dictionaries/foodDictionaryItem';

export abstract class DietaryChangeItem<T = any> {
  public currentValue: T;
  constructor(public readonly foodItem: FoodDictionaryItem, public readonly scenarioValue: T) {}
}

export class CompositionChangeItem extends DietaryChangeItem<number> {}
export class ConsumptionChangeItem extends DietaryChangeItem<number> {}
export class FoodItemChangeItem extends DietaryChangeItem<FoodDictionaryItem> {} // TODO: update with FoodItem type
