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
  public readonly foodVehicleStandard: Array<FoodVehicleStandard>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.interventionId = this._getNumber(InterventionFoodVehicleStandards.KEYS.INTERVENTION_ID);
    this.foodVehicleStandard = this._getArray(InterventionFoodVehicleStandards.KEYS.FOOD_VEHICLE_STANDARD);
  }
}
export interface FoodVehicleStandard {
  micronutrient: string;
  compounds: Array<Compounds>;
}
export interface Compounds {
  compound: string;
  targetVal: number;
  targetValDefault: number;
  targetValEdited: number;
  rowIndex: number;
  rowUnits: string;
  isEditable: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}
