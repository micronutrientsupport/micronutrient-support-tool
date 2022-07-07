import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class Intervention extends BaseObject implements Named {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    DESCRIPTION: 'description',
    COUNTRY_ID: 'countryId',
    FORTIFICATION_ID: 'fortificationTypeId',
    FORTIFICATION_NAME: 'fortificationTypeName',
    PROGRAM_STATUS: 'programStatus',
    FOOD_VEHICLE_ID: 'foodVehicleId',
    FOOD_VEHICLE_NAME: 'foodVehicleName',
    BASE_YEAR: 'baseYear',
    TEN_YEAR_TOTAL: 'tenYearTotalCost',
  };

  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly dataLevel: DataLevel;

  public readonly countryId: string;
  public readonly fortificationTypeId: string;
  public readonly fortificationTypeName: string;
  public readonly programStatus: string;
  public readonly foodVehicleId: number;
  public readonly foodVehicleName: string;
  public readonly baseYear: number;
  public readonly tenYearTotalCost: number;
  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.id = this._getNumber(Intervention.KEYS.ID);
    this.name = this._getString(Intervention.KEYS.NAME);
    this.description = this._getString(Intervention.KEYS.DESCRIPTION);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.countryId = this._getString(Intervention.KEYS.COUNTRY_ID);
    this.fortificationTypeId = this._getString(Intervention.KEYS.FORTIFICATION_ID);
    this.fortificationTypeName = this._getString(Intervention.KEYS.FORTIFICATION_NAME);
    this.programStatus = this._getString(Intervention.KEYS.PROGRAM_STATUS);
    this.foodVehicleId = this._getNumber(Intervention.KEYS.FOOD_VEHICLE_ID);
    this.foodVehicleName = this._getString(Intervention.KEYS.FOOD_VEHICLE_NAME);
    this.baseYear = this._getNumber(Intervention.KEYS.BASE_YEAR);
    this.tenYearTotalCost = this._getNumber(Intervention.KEYS.TEN_YEAR_TOTAL);
  }
}
