import { BaseObject } from '../_lib_code/objects/baseObject';
import { CurrentValue } from './currentValue.interface';

export class CurrentComposition extends BaseObject implements CurrentValue {
  public static readonly KEYS = {
    VALUE: 'value',
    UNITS: 'units',
  };

  public readonly value: number;
  public readonly units: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.value = this._getNumber(CurrentComposition.KEYS.VALUE);
    this.units = this._getString(CurrentComposition.KEYS.UNITS);
  }
}
