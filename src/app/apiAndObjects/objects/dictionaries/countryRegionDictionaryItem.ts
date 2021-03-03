import * as GeoJSON from 'geojson';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class CountryDictionaryItem extends MapsDictionaryItem {
  public static readonly GEOMETRY_ATTRIBUTE = 'geometry';

  public readonly geoFeature: GeoJSON.Feature;

  protected constructor(
    sourceObject: Record<string, unknown>,
    id: string,
    name: string,
    description: string,
  ) {
    super(sourceObject, id, name, description);

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

  public static createMockItems(isCountry: boolean): Array<Record<string, unknown>> {
    const name = (isCountry) ? 'Country' : 'Region';
    return new Array(20).fill(null)
      .map((val, index: number) => {
        const returnObj = {};
        returnObj[this.ID_ATTRIBUTE] = `${index}`;
        returnObj[this.NAME_ATTRIBUTE] = `${name} ${index}`;
        returnObj[this.DESC_ATTRIBUTE] = `${name} ${index} description`;
        returnObj[this.GEOMETRY_ATTRIBUTE] = {
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
        return returnObj;
      });
  }
}
