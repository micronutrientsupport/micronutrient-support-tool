import { BaseObject } from '../_lib_code/objects/baseObject';

export class TopFoodSource extends BaseObject {
  public static readonly KEYS = {
    FOODEX2_NAME: 'foodex2_name',
    VALUE: 'value',
  };

  public readonly foodex2Name: string;
  public readonly value: number;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.foodex2Name = this._getString(TopFoodSource.KEYS.FOODEX2_NAME);
    this.value = this._getNumber(TopFoodSource.KEYS.VALUE);
  }
}
