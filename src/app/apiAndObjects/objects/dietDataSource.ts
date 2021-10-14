import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class DietDataSource extends BaseObject implements Named {
  public static readonly KEYS = {
    NAME: 'displayName',
    // COUNTRY_ID: 'countryId', // needed? if so we might grab the dictionary item.
    CONSUMPTION_DATA_TYPE: 'consumptionDataType',

    CONSUMPTION_DATA_ID: 'consumptionDataId',
    CONSUMPTION_DATA_NAME: 'consumptionDataName',
    CONSUMPTION_DATA_DESC: 'consumptionDataDescription',
    CONSUMPTION_DATA_META_ID: 'consumptionDataMetadataId',

    COMPOSITION_DATA_ID: 'compositionDataId',
    COMPOSITION_DATA_NAME: 'compositionDataName',
    COMPOSITION_DATA_DESC: 'compositionDataDescription',
    COMPOSITION_DATA_META_ID: 'compositionDataMetadataId',

    MN_ID: 'micronutrientId',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly consumptionDataId: string;
  public readonly consumptionDataName: string;
  public readonly consumptionDataDesc: string;
  public readonly consumptionDataMetaId: string;

  public readonly compositionDataId: string;
  public readonly compositionDataName: string;
  public readonly compositionDataDesc: string;
  public readonly compositionDataMetaId: string;
  public readonly year: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.name = this._getString(DietDataSource.KEYS.NAME);

    this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.consumptionDataId = this._getString(DietDataSource.KEYS.CONSUMPTION_DATA_ID);
    this.consumptionDataName = this._getString(DietDataSource.KEYS.CONSUMPTION_DATA_NAME);
    this.consumptionDataDesc = this._getString(DietDataSource.KEYS.CONSUMPTION_DATA_DESC);
    this.consumptionDataMetaId = this._getString(DietDataSource.KEYS.CONSUMPTION_DATA_META_ID);

    this.compositionDataId = this._getString(DietDataSource.KEYS.COMPOSITION_DATA_ID);
    this.compositionDataName = this._getString(DietDataSource.KEYS.COMPOSITION_DATA_NAME);
    this.compositionDataDesc = this._getString(DietDataSource.KEYS.COMPOSITION_DATA_DESC);
    this.compositionDataMetaId = this._getString(DietDataSource.KEYS.COMPOSITION_DATA_META_ID);
  }
}
