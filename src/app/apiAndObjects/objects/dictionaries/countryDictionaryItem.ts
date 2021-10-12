import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import * as GeoJSON from 'geojson';
import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class CountryDictionaryItem extends MapsDictionaryItem {
  public static readonly DESC_ATTRIBUTE: string = 'name';
  public static readonly KEYS = {
    GEOMETRY: 'geometry',
  };

  public readonly geoFeature: GeoJSON.Feature;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
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

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return httpClient.get('/assets/exampleData/country_select.json').toPromise() as Promise<
      Array<Record<string, unknown>>
    >;
  }
}
