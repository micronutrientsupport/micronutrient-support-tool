import { BaseObject } from '../_lib_code/objects/baseObject';
import { CurrentValue } from './currentValue.interface';

export class CurrentComposition extends BaseObject implements CurrentValue {
  public static readonly KEYS = {
    FOOD_GENUS_ID: 'foodGenusId',
    COMPOSITION_DATA_ID: 'compositionDataId',
    MICRONUTRIENT_ID: 'micronutrientId',
    VALUE: 'micronutrientValue',
  };

  public readonly value: number;
  public readonly units = 'mg/kg';
  public readonly valueAndUnits: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.value = this._getNumber(CurrentComposition.KEYS.VALUE);
    this.valueAndUnits = `${this.value} ${this.units}`;
  }
}
