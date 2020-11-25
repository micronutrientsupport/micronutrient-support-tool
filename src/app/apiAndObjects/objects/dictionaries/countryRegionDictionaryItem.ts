/* eslint-disable @typescript-eslint/member-ordering */
import * as GeoJSON from 'geojson';
import { DictionaryType } from '../../api/dictionaryType.enum';
import { BaseDictionaryItem } from '../../_lib_code/objects/baseDictionaryItem';

export class CountryDictionaryItem extends BaseDictionaryItem {
  public static readonly ID_ATTRIBUTE = 'id';
  public static readonly NAME_ATTRIBUTE = 'name';
  public static readonly DESC_ATTRIBUTE = 'name';
  public static readonly GEOMETRY_ATTRIBUTE = 'geometry';

  protected _sourceAttributeId = CountryDictionaryItem.ID_ATTRIBUTE;
  protected _sourceAttributeName = CountryDictionaryItem.NAME_ATTRIBUTE;
  protected _sourceAttributeDesc = CountryDictionaryItem.DESC_ATTRIBUTE;

  public geoFeature: GeoJSON.Feature;

  protected populateValues(): void {
    super.populateValues();
    this.geoFeature = this._getValue(CountryDictionaryItem.GEOMETRY_ATTRIBUTE) as GeoJSON.Feature;
  }

  public static createMockItems(count: number, type: DictionaryType): Array<Record<string, unknown>> {
    return super.createMockItems(count, type).map((item: Record<string, unknown>, index: number) => {
      item[this.GEOMETRY_ATTRIBUTE] = {
        type: 'MultiPolygon',
        coordinates: [[[
          [index, index],
          [index, index + 1],
          [index + 1, index + 1],
          [index + 1, index],
          [index, index],
        ]]],
      };
      return item;
    });
  }
}
