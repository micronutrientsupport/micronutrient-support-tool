import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export type FEATURE_TYPE = GeoJSON.Feature<GeoJSON.Geometry, MnAvailibiltyItemFeatureProperties>;

export abstract class MnAvailibiltyItem extends BaseObject implements Exportable {
  public static readonly KEYS = {
    AREA_ID: 'aggregationAreaId',
    AREA_NAME: 'aggregationAreaName',
    AREA_TYPE: 'aggregationAreaType',
    // "consumptionDataId"
    // "compositionDataId"
    // "countryId"
    // "micronutrientId"
    GEOMETRY: 'geometry',
    UNIT: 'unit',
    DIETARY_SUPPLY: 'dietarySupply',
    DEFICIENT_VALUE: 'deficientValue',
    DEFICIENT_PERC: 'deficientPercentage',
  };

  public readonly areaId: string;
  public readonly areaName: string;
  public readonly areaType: string;
  public readonly geometry: GeoJSON.Geometry;
  public readonly unit: string;
  public readonly dietarySupply: number;
  public readonly deficientValue: number;
  public readonly deficientPercentage: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.areaId = this._getString(MnAvailibiltyItem.KEYS.AREA_ID);
    this.areaName = this._getString(MnAvailibiltyItem.KEYS.AREA_NAME);
    this.areaType = this._getString(MnAvailibiltyItem.KEYS.AREA_TYPE);
    this.geometry = this._getValue(MnAvailibiltyItem.KEYS.GEOMETRY) as GeoJSON.Geometry;
    this.unit = this._getString(MnAvailibiltyItem.KEYS.UNIT);
    this.dietarySupply = this._getNumber(MnAvailibiltyItem.KEYS.DIETARY_SUPPLY);
    this.deficientValue = this._getNumber(MnAvailibiltyItem.KEYS.DEFICIENT_VALUE);
    this.deficientPercentage = this._getNumber(MnAvailibiltyItem.KEYS.DEFICIENT_PERC);
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
        areaName: this.areaName,
        areaType: this.areaType,
        unit: this.unit,
        dietarySupply: this.dietarySupply,
        deficientValue: this.deficientValue,
        deficientPercentage: this.deficientPercentage,
      },
    } as FEATURE_TYPE;
  }
}

export interface MnAvailibiltyItemFeatureProperties {
  // type: '';
  areaName: string;
  areaType: string;
  unit: string;
  dietarySupply: number;
  deficientValue: number;
  deficientPercentage: number;
}
