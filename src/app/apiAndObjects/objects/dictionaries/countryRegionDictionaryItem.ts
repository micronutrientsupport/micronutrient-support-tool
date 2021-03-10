import * as GeoJSON from 'geojson';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class CountryDictionaryItem extends MapsDictionaryItem {
  public static readonly DESC_ATTRIBUTE: string = 'name';
  public static readonly KEYS = {
    GEOMETRY: 'geometry',
  };

  public readonly geoFeature: GeoJSON.Feature;

  protected constructor(
    sourceObject: Record<string, unknown>,
    id: string,
    name: string,
    description: string,
  ) {
    super(sourceObject, id, name, description);

    const geometry = this._getValue(CountryDictionaryItem.KEYS.GEOMETRY) as GeoJSON.Geometry;
    if (null != geometry) {
      this.geoFeature = {
        geometry,
        type: 'Feature',
        properties: {},
        id: this.id,
      };
    }
  }

  public static createMockItems(isCountry: boolean, count = 20): Array<Record<string, unknown>> {
    const name = (isCountry) ? 'Country' : 'Region';
    return new Array(count).fill(null)
      .map((val, index: number) => {
        const returnObj = {};
        returnObj[this.ID_ATTRIBUTE] = `${index}`;
        returnObj[this.NAME_ATTRIBUTE] = `${name} ${index}`;
        returnObj[this.DESC_ATTRIBUTE] = `${name} ${index} description`;
        returnObj[this.KEYS.GEOMETRY] = {
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
