import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionFoodVehicleStandards extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    FOOD_VEHICLE_STANDARD: 'foodVehicleStandard',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly foodVehicleStandard: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionFoodVehicleStandards.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionFoodVehicleStandards.KEYS.INTERVENTION_ID);
    this.foodVehicleStandard = this._getString(InterventionFoodVehicleStandards.KEYS.FOOD_VEHICLE_STANDARD);
  }
}
