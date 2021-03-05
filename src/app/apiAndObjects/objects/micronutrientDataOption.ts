import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';

export class MicronutrientDataOption extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
  };

  public readonly id: string;
  public readonly name: string;
  public readonly dataLevelOptions: Array<DataLevel>;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(MicronutrientDataOption.KEYS.ID);
    this.name = this._getString(MicronutrientDataOption.KEYS.NAME);

    // TODO: set from data when available
    this.dataLevelOptions = [
      DataLevel.HOUSEHOLD,
      // DataLevel.COUNTRY,
    ];
  }
}
