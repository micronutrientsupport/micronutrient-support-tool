import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { BaselineAssumptions } from './interventionBaselineAssumptions';
import { FoodVehicleStandard } from './iiiiiiinterventionFoodVehicleStandards';
import { IndustryInformation } from './interventionIndustryInformation';
import { MonitoringInformation } from './interventionMonitoringInformation';
import { RecurringCost } from './interventionRecurringCosts';
import { StartUpScaleUpCost } from './interventionStartupCosts';
import { Named } from './named.interface';

export class InterventionData extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    BASELINE_ASSUMPTION: 'baselineAssumptions',
    FOOD_VEHICLE_STANDARD: 'foodVehicleStandard',
    INDUSTRY_INFORMATION: 'industryInformation',
    MONITORING_INFORMATION: 'monitoringInformation',
    STARTUP_COST: 'startupScaleupCosts',
    RECURRING_COST: 'recurringCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly baselineAssumptions: BaselineAssumptions | unknown;
  public readonly foodVehicleStandard: Array<FoodVehicleStandard>;
  public readonly industryInformation: Array<IndustryInformation>;
  public readonly monitoringInformation: Array<MonitoringInformation>;
  public readonly startupScaleupCosts: Array<StartUpScaleUpCost>;
  public readonly recurringCosts: Array<RecurringCost>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionData.KEYS.INTERVENTION_ID);
    this.baselineAssumptions = this._getString(InterventionData.KEYS.BASELINE_ASSUMPTION);
    this.foodVehicleStandard = this._getArray(InterventionData.KEYS.FOOD_VEHICLE_STANDARD);
    this.industryInformation = this._getArray(InterventionData.KEYS.INDUSTRY_INFORMATION);
    this.monitoringInformation = this._getArray(InterventionData.KEYS.MONITORING_INFORMATION);
    this.startupScaleupCosts = this._getArray(InterventionData.KEYS.STARTUP_COST);
    this.recurringCosts = this._getArray(InterventionData.KEYS.RECURRING_COST);
  }
}
