import { BaseObject } from '../_lib_code/objects/baseObject';

export class MicronutrientDataOption extends BaseObject {
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

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(MicronutrientDataOption.KEYS.ID);
    this.name = this._getString(MicronutrientDataOption.KEYS.NAME);
  }
}
