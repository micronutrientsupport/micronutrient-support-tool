import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionRecurringCosts extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    RECURRING_COSTS: 'recurringCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly recurringCosts: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionRecurringCosts.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionRecurringCosts.KEYS.INTERVENTION_ID);
    this.recurringCosts = this._getString(InterventionRecurringCosts.KEYS.RECURRING_COSTS);
  }
}
