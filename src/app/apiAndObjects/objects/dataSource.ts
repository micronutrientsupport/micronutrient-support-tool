import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';

export class DataSource extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    // COUNTRY_ID: 'countryId', // needed? if so we might grab the dictionary item.
    CONSUMPTION_DATA_TYPE: 'consumptionDataType',
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_DATA_ID: 'compositionDataId',
  };

  public readonly id: string;
  public readonly name: string;
  public readonly dataLevelOptions: Array<DataLevel>;
  public readonly consumptionDataId: string;
  public readonly compositionDataId: string;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(DataSource.KEYS.ID);
    this.name = this._getString(DataSource.KEYS.NAME);

    // converted to an array as suggested this might be needed,
    // but api response currently a string, rather than an array of strings
    this.dataLevelOptions = [this._getEnum(DataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel)];

    this.consumptionDataId = this._getString(DataSource.KEYS.CONSUMPTION_DATA_ID);
    this.compositionDataId = this._getString(DataSource.KEYS.COMPOSITION_DATA_ID);
  }
}
