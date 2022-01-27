import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionData extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    BASELINE_ASSUMPTION: 'baselineAssumptions',
    FOOD_VEHICLE_STANDARD: 'foodVehicleStandard',
    INDUSTRY_INFORMATION: 'industryInformation',
    MONITORING_INFO: 'monitoringInformation',
    STARTUP_COST: 'startupScaleupCosts',
    RECURRING_COST: 'recurringCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly baselineAssumptions: string;
  public readonly foodVehicleStandard: string;
  public readonly industryInformation: string;
  public readonly monitoringInformation: string;
  public readonly startupScaleupCosts: string;
  public readonly recurringCosts: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionData.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionData.KEYS.INTERVENTION_ID);
    this.baselineAssumptions = this._getString(InterventionData.KEYS.BASELINE_ASSUMPTION);
    this.foodVehicleStandard = this._getString(InterventionData.KEYS.FOOD_VEHICLE_STANDARD);
    this.industryInformation = this._getString(InterventionData.KEYS.INDUSTRY_INFORMATION);
    this.monitoringInformation = this._getString(InterventionData.KEYS.MONITORING_INFO);
    this.startupScaleupCosts = this._getString(InterventionData.KEYS.STARTUP_COST);
    this.recurringCosts = this._getString(InterventionData.KEYS.RECURRING_COST);
  }
}
