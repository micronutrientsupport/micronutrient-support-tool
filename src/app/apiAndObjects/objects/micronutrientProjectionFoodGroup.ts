import { MicronutrientProjectionSource } from './micronutrientProjectionSource.abstract';

export class MicronutrientProjectionFoodGroup extends MicronutrientProjectionSource {
  public static readonly KEYS = {
    ...MicronutrientProjectionSource.KEYS,
    FOOD_GROUP: 'foodGroup',
  };

  public name: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.name = this._getString(MicronutrientProjectionFoodGroup.KEYS.FOOD_GROUP);
  }
}
