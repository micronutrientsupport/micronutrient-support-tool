import { BaseObject } from '../_lib_code/objects/baseObject';

export class ImpactScenario extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    BRIEF_DESCRIPTION: 'briefDescription',
    DESCRIPTION: 'description',
    IS_BASELINE: 'isBaseline',
  };

  public readonly id: string;
  public readonly name: string;
  public readonly briefDescription: string;
  public readonly description: string;
  public readonly isBaseline: boolean;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.id = this._getString(ImpactScenario.KEYS.ID);
    this.name = this._getString(ImpactScenario.KEYS.NAME);
    this.briefDescription = this._getString(ImpactScenario.KEYS.BRIEF_DESCRIPTION);
    this.description = this._getString(ImpactScenario.KEYS.DESCRIPTION);
    this.isBaseline = this._getBoolean(ImpactScenario.KEYS.IS_BASELINE);
  }
}
