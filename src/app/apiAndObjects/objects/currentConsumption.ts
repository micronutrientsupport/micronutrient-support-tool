import { BaseObject } from '../_lib_code/objects/baseObject';
import { CurrentValue } from './currentValue.interface';

export class CurrentConsumption extends BaseObject implements CurrentValue {
  public static readonly KEYS = {
    FOOD_GENUS_ID: 'foodGenusId',
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    VALUE: 'consumptionValue',
  };

  public readonly value: number;
  public readonly units = 'ml/AME/day';

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.value = this._getNumber(CurrentConsumption.KEYS.VALUE);
  }
}
