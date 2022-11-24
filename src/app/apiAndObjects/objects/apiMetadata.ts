import { BaseObject } from '../_lib_code/objects/baseObject';

export class ApiMetadata extends BaseObject {
  public static readonly KEYS = {
    API: 'api',
    SCHEMA: 'schema',
    DATA: 'seed',
    // COUNTRY_ID: 'countryId', // needed? if so we might grab the dictionary item.
  };

  public readonly apiVersion: string;
  public readonly schemaVersion: string;
  public readonly dataVersion: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.apiVersion = this._getString(ApiMetadata.KEYS.API);
    this.schemaVersion = this._getString(ApiMetadata.KEYS.SCHEMA);
    this.dataVersion = this._getString(ApiMetadata.KEYS.DATA);
  }
}
