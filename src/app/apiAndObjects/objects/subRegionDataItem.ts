import { BaseObject } from '../_lib_code/objects/baseObject';

export class SubRegionDataItem extends BaseObject {
  public static readonly KEYS = {
    // COUNTRY_ID: 'countryId',
    // FCT_SOURCE_ID: 'fctSourceId',
    // DATA_SOURCE_ID: 'dataSourceId',
    // MN_NAME: 'mnName',
    // MN_VALUE: 'mnValue',
    GEOMETRY: 'geojson',
  };

  public readonly geoJson: GeoJSON.FeatureCollection;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.geoJson = this._getValue(SubRegionDataItem.KEYS.GEOMETRY) as GeoJSON.FeatureCollection;
  }
}
