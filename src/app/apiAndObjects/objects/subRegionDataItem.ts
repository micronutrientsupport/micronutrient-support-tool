import { BaseObject } from '../_lib_code/objects/baseObject';

export class SubRegionDataItem extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    // COUNTRY_ID: 'country_id', // not needded?
    COUNTRY_NAME: 'country_name',
    SUB_REGION_NAME: 'subregion_name',
    SUB_REGION_TYPE: 'subregion_type',
    GEOMETRY: 'geometry',
    MN_ABSOLUTE: 'mn_absolute',
    MN_ABSOLUTE_UNIT: 'mn_absolute_unit',
    MN_THRESHOLD: 'mn_threshold',
    MN_THRESHOLD_UNIT: 'mn_threshold_unit',
    HOUSHOLDS_SURVEYED: 'households_surveyed'
  };

  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly countryName: string;
  public readonly geoFeature: GeoJSON.Feature;
  public readonly mnAbsolute: number;
  public readonly mnAbsoluteUnit: string;
  public readonly mnThreshold: number;
  public readonly mnThresholdUnit: string;
  public readonly householdsSurveyed: number;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(SubRegionDataItem.KEYS.ID);
    this.name = this._getString(SubRegionDataItem.KEYS.SUB_REGION_NAME);
    this.type = this._getString(SubRegionDataItem.KEYS.SUB_REGION_TYPE);
    this.mnAbsolute = this._getNumber(SubRegionDataItem.KEYS.MN_ABSOLUTE);
    this.mnAbsoluteUnit = this._getString(SubRegionDataItem.KEYS.MN_ABSOLUTE_UNIT);
    this.mnThreshold = this._getNumber(SubRegionDataItem.KEYS.MN_THRESHOLD);
    this.mnThresholdUnit = this._getString(SubRegionDataItem.KEYS.MN_THRESHOLD_UNIT);
    this.householdsSurveyed = this._getNumber(SubRegionDataItem.KEYS.HOUSHOLDS_SURVEYED);

    const geometry = this._getValue(SubRegionDataItem.KEYS.GEOMETRY) as GeoJSON.Geometry;
    if (null != geometry) {
      this.geoFeature = {
        geometry,
        type: 'Feature',
        properties: {
          mnAbsolute: this.mnAbsolute,
          mnAbsoluteUnit: this.mnAbsoluteUnit,
          mnThreshold: this.mnThreshold,
          mnThresholdUnit: this.mnThresholdUnit,
          householdsSurveyed: this.householdsSurveyed,
          subRegionName: this.name,
        },
        id: this.id,
      };
    }
  }
}
