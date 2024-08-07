import { Moment } from 'moment';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class InterventionsDictionaryItem extends MapsDictionaryItem {
  public static readonly DESC_ATTRIBUTE: string = 'name';
  public static readonly KEYS = {
    COUNTRY_ID: 'countryId',
    FORTIFICATION_ID: 'fortificationTypeId',
    FORTIFICATION_NAME: 'fortificationTypeName',
    PROGRAM_STATUS: 'programStatus',
    FOOD_VEHICLE_ID: 'foodVehicleId',
    FOOD_VEHICLE_NAME: 'foodVehicleName',
    BASE_YEAR: 'baseYear',
    TEN_YEAR_TOTAL: 'tenYearTotalCost',
    LAST_EDITED: 'lastEdited',
    IS_TEMPLATE_INTERVENTION: 'isTemplateIntervention',
    TEMPLATE_DATE: 'templateDate',
    PARENT_INTERVENTION: 'parentIntervention',
  };
  public readonly countryId: string;
  public readonly fortificationTypeId: string;
  public readonly fortificationTypeName: string;
  public readonly programStatus: string;
  public readonly foodVehicleId: number;
  public readonly foodVehicleName: string;
  public readonly baseYear: number;
  public readonly tenYearTotalCost: number;
  public readonly lastEdited: string;
  public readonly isTemplateIntervention: boolean;
  public readonly parentIntervention: number;
  public readonly templateDate: Moment;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
    super(sourceObject, id, name, description);

    this.countryId = this._getString(InterventionsDictionaryItem.KEYS.COUNTRY_ID);
    this.fortificationTypeId = this._getString(InterventionsDictionaryItem.KEYS.FORTIFICATION_ID);
    this.fortificationTypeName = this._getString(InterventionsDictionaryItem.KEYS.FORTIFICATION_NAME);
    this.programStatus = this._getString(InterventionsDictionaryItem.KEYS.PROGRAM_STATUS);
    this.foodVehicleId = this._getNumber(InterventionsDictionaryItem.KEYS.FOOD_VEHICLE_ID);
    this.foodVehicleName = this._getString(InterventionsDictionaryItem.KEYS.FOOD_VEHICLE_NAME);
    this.baseYear = this._getNumber(InterventionsDictionaryItem.KEYS.BASE_YEAR);
    this.tenYearTotalCost = this._getNumber(InterventionsDictionaryItem.KEYS.TEN_YEAR_TOTAL);
    this.lastEdited = this._getString(InterventionsDictionaryItem.KEYS.LAST_EDITED);
    this.isTemplateIntervention = this._getBoolean(InterventionsDictionaryItem.KEYS.IS_TEMPLATE_INTERVENTION);
    this.parentIntervention = this._getNumber(InterventionsDictionaryItem.KEYS.PARENT_INTERVENTION);
    this.templateDate = this._getDate(InterventionsDictionaryItem.KEYS.TEMPLATE_DATE);
  }
}
