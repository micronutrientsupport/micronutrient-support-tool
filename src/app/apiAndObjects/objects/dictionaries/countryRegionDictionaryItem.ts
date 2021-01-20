/* eslint-disable @typescript-eslint/member-ordering */
import * as GeoJSON from 'geojson';
import { DictionaryType } from '../../api/dictionaryType.enum';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class CountryDictionaryItem extends MapsDictionaryItem {
  public static readonly GEOMETRY_ATTRIBUTE = 'geometry';

  public geoFeature: GeoJSON.Feature;

  public static createMockItems(count: number, type: DictionaryType): Array<Record<string, unknown>> {
    return super.createMockItems(count, type).map((item: Record<string, unknown>, index: number) => {
      item[this.GEOMETRY_ATTRIBUTE] = {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [index, index],
              [index, index + 1],
              [index + 1, index + 1],
              [index + 1, index],
              [index, index],
            ],
          ],
        ],
      };
      return item;
    });
  }

  protected populateValues(): void {
    super.populateValues();
    const geometry = this._getValue(CountryDictionaryItem.GEOMETRY_ATTRIBUTE) as GeoJSON.Geometry;
    if (null != geometry) {
      this.geoFeature = {
        geometry,
        type: 'Feature',
        properties: {},
        id: this.id,
      };
    }
  }
}
