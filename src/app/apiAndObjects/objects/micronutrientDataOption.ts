import { BaseObject } from '../_lib_code/objects/baseObject';

export class MicronutrientDataOption extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
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
