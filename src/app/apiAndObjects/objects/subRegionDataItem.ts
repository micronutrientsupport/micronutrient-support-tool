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

  public id: string;
  public name: string;
  public type: string;
  public countryName: string;
  public geoFeature: GeoJSON.Feature;
  public mnAbsolute: number;
  public mnAbsoluteUnit: string;
  public mnThreshold: number;
  public mnThresholdUnit: string;
  public householdsSurveyed: number;

  public static makeItemFromObject(source: Record<string, unknown>): SubRegionDataItem {
    return super.makeItemFromObject(source) as SubRegionDataItem;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.id = this._getString(SubRegionDataItem.KEYS.ID);
    this.name = this._getString(SubRegionDataItem.KEYS.SUB_REGION_NAME);
    this.type = this._getString(SubRegionDataItem.KEYS.SUB_REGION_TYPE);
    this.geoFeature = this._getValue(SubRegionDataItem.KEYS.GEOMETRY) as GeoJSON.Feature;
    this.mnAbsolute = this._getNumber(SubRegionDataItem.KEYS.MN_ABSOLUTE);
    this.mnAbsoluteUnit = this._getString(SubRegionDataItem.KEYS.MN_ABSOLUTE_UNIT);
    this.mnThreshold = this._getNumber(SubRegionDataItem.KEYS.MN_THRESHOLD);
    this.mnThresholdUnit = this._getString(SubRegionDataItem.KEYS.MN_THRESHOLD_UNIT);
    this.householdsSurveyed = this._getNumber(SubRegionDataItem.KEYS.HOUSHOLDS_SURVEYED);
  }
}
