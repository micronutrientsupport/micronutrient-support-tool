import { BaseObject } from '../_lib_code/objects/baseObject';

export class CurrentConsumption extends BaseObject {
  public static readonly KEYS = {
    VALUE: 'value',
    UNITS: 'units',
  };

  public readonly value: number;
  public readonly units: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.value = this._getNumber(CurrentConsumption.KEYS.VALUE);
    this.units = this._getString(CurrentConsumption.KEYS.UNITS);
  }
}