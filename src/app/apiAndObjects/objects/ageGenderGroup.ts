import { BaseObject } from '../_lib_code/objects/baseObject';

export class AgeGenderGroup extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    DESCRIPTION: 'description',
  };

  public readonly id: string;
  public readonly name: string;
  public readonly description: string;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(AgeGenderGroup.KEYS.ID);
    this.name = this._getString(AgeGenderGroup.KEYS.NAME);
    this.description = this._getString(AgeGenderGroup.KEYS.DESCRIPTION);
  }
}
