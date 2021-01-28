import { BaseObject } from '../_lib_code/objects/baseObject';

export class ImpactScenario extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
    BRIEF_DESCRIPTION: 'briefDescription',
    DESCRIPTION: 'description',
    IS_BASELINE: 'isBaseline',
  };

  public id: string;
  public name: string;
  public briefDescription: string;
  public description: string;
  public isBaseline: boolean;

  public static makeItemFromObject(source: Record<string, unknown>): ImpactScenario {
    return super.makeItemFromObject(source) as ImpactScenario;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.id = this._getString(ImpactScenario.KEYS.ID);
    this.name = this._getString(ImpactScenario.KEYS.NAME);
    this.briefDescription = this._getString(ImpactScenario.KEYS.NAME);
    this.description = this._getString(ImpactScenario.KEYS.NAME);
    this.isBaseline = this._getBoolean(ImpactScenario.KEYS.NAME);
  }
}
