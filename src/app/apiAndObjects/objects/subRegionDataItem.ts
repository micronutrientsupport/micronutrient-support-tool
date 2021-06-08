import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class SubRegionDataItem extends BaseObject implements Exportable {
  public static readonly KEYS = {
    // COUNTRY_ID: 'countryId',
    // FCT_SOURCE_ID: 'fctSourceId',
    // DATA_SOURCE_ID: 'dataSourceId',
    // MN_NAME: 'mnName',
    // MN_VALUE: 'mnValue',
    GEOMETRY: 'geojson',
  };

  public readonly geoJson: GeoJSON.FeatureCollection;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.geoJson = this._getValue(SubRegionDataItem.KEYS.GEOMETRY) as GeoJSON.FeatureCollection;
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'MapViewData';
  }
}
