import { BaseObject } from '../_lib_code/objects/baseObject';

export class TopFoodSource extends BaseObject {
  public static readonly KEYS = {
    FOOD_NAME: 'foodName',
    VALUE: 'mnConsumedPerDay',
  };

  public readonly foodName: string;
  public readonly value: number;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.foodName = this._getString(TopFoodSource.KEYS.FOOD_NAME);
    this.value = this._getNumber(TopFoodSource.KEYS.VALUE);
  }
}
