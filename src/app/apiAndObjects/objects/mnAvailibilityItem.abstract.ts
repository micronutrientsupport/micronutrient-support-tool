import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export type FEATURE_TYPE = GeoJSON.Feature<GeoJSON.Geometry, MnAvailibiltyItemFeatureProperties>;

export abstract class MnAvailibiltyItem extends BaseObject implements Exportable {
  public static readonly KEYS = {
    AREA_ID: 'aggregationAreaId',
    AREA_NAME: 'aggregationAreaName',
    AREA_TYPE: 'aggregationAreaType',
    COMPOSITION_DATA_ID: 'compositionDataId',
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COUNTRY_ID: 'countryId',
    DEFICIENT_COUNT: 'deficientCount',
    DEFICIENT_PERC: 'deficientPercentage',
    DEFICIENT_VALUE: 'deficientValue',
    DIETARY_SUPPLY: 'dietarySupply',
    GEOMETRY: 'geometry',
    HOUSEHOLD_COUNT: 'householdCount',
    MICRONUTRIENT_ID: 'micronutrientId',
    UNIT: 'unit',
  };

  public readonly areaId: string;
  public readonly areaName: string;
  public readonly areaType: string;
  public readonly compositionDataId: number;
  public readonly consumptionDataId: number;
  public readonly countryId: string;
  public readonly deficientCount: number;
  public readonly deficientPercentage: number;
  public readonly deficientValue: number;
  public readonly dietarySupply: number;
  public readonly geometry: GeoJSON.Geometry;
  public readonly householdCount: number;
  public readonly micronutrientId: string;
  public readonly unit: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.areaId = this._getString(MnAvailibiltyItem.KEYS.AREA_ID);
    this.areaName = this._getString(MnAvailibiltyItem.KEYS.AREA_NAME);
    this.areaType = this._getString(MnAvailibiltyItem.KEYS.AREA_TYPE);
    this.compositionDataId = this._getNumber(MnAvailibiltyItem.KEYS.COMPOSITION_DATA_ID);
    this.consumptionDataId = this._getNumber(MnAvailibiltyItem.KEYS.CONSUMPTION_DATA_ID);
    this.countryId = this._getString(MnAvailibiltyItem.KEYS.COUNTRY_ID);
    this.deficientCount = this._getNumber(MnAvailibiltyItem.KEYS.DEFICIENT_COUNT);
    this.deficientPercentage = this._getNumber(MnAvailibiltyItem.KEYS.DEFICIENT_PERC);
    this.deficientValue = this._getNumber(MnAvailibiltyItem.KEYS.DEFICIENT_VALUE);
    this.dietarySupply = this._getNumber(MnAvailibiltyItem.KEYS.DIETARY_SUPPLY);
    this.geometry = this._getValue(MnAvailibiltyItem.KEYS.GEOMETRY) as GeoJSON.Geometry;
    this.householdCount = this._getNumber(MnAvailibiltyItem.KEYS.HOUSEHOLD_COUNT);
    this.micronutrientId = this._getString(MnAvailibiltyItem.KEYS.MICRONUTRIENT_ID);
    this.unit = this._getString(MnAvailibiltyItem.KEYS.UNIT);
  }

  public getExportObject(): Record<string, unknown> {
    return this._sourceObject;
  }
  public getExportFileName(): string {
    return 'MapViewData';
  }

  public toFeature(): FEATURE_TYPE {
    return {
      type: 'Feature',
      geometry: this.geometry,
      properties: {
        areaId: this.areaId,
        areaName: this.areaName,
        areaType: this.areaType,
        compositionDataId: this.compositionDataId,
        consumptionDataId: this.consumptionDataId,
        countryId: this.countryId,
        deficientCount: this.deficientCount,
        deficientPercentage: this.deficientPercentage,
        deficientValue: this.deficientValue,
        dietarySupply: this.dietarySupply,
        householdCount: this.householdCount,
        micronutrientId: this.micronutrientId,
        unit: this.unit,
      },
    } as FEATURE_TYPE;
  }
}

export interface MnAvailibiltyItemFeatureProperties {
  areaId: string;
  areaName: string;
  areaType: string;
  compositionDataId: number;
  consumptionDataId: number;
  countryId: string;
  deficientCount: number;
  deficientPercentage: number;
  deficientValue: number;
  dietarySupply: number;
  geometry: GeoJSON.Geometry;
  householdCount: number;
  micronutrientId: string;
  unit: string;
}
