import { BaseObject } from '../_lib_code/objects/baseObject';
import { Named } from './named.interface';

export class Region extends BaseObject implements Named {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    COUNTRY: 'country',
    TYPE: 'type',
    ADMIN_LEVEL: 'adminLevel',
    GEOMETRY: 'geometry',
  };

  public readonly id: string;
  public readonly name: string;
  public readonly country: string;
  public readonly type: string;
  public readonly adminLevel: number;
  public readonly geometry: GeoJSON.Geometry;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.id = this._getString(Region.KEYS.ID);
    this.name = this._getString(Region.KEYS.NAME);
    this.country = this._getString(Region.KEYS.COUNTRY);
    this.type = this._getString(Region.KEYS.TYPE);
    this.adminLevel = this._getNumber(Region.KEYS.ADMIN_LEVEL);
    this.geometry = this._getValue(Region.KEYS.GEOMETRY) as GeoJSON.Geometry;
  }
}
