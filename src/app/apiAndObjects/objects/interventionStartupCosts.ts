import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionStartupCosts extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    STARTUP_COSTS: 'startupScaleupCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly startupScaleupCosts: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionStartupCosts.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionStartupCosts.KEYS.INTERVENTION_ID);
    this.startupScaleupCosts = this._getString(InterventionStartupCosts.KEYS.STARTUP_COSTS);
  }
}
