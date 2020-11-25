import { BaseObject } from '../_lib_code/objects/baseObject';

export class PopulationGroup extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
  };

  public id: string;
  public name: string;

  public static makeItemFromObject(source: Record<string, unknown>): PopulationGroup {
    return super.makeItemFromObject(source) as PopulationGroup;
  }

  public static createMockItems(count: number): Array<Record<string, unknown>> {
    return new Array(count).fill(null).map((val, index: number) => {
      const returnObj = {};
      returnObj[PopulationGroup.KEYS.ID] = `${index}`;
      returnObj[PopulationGroup.KEYS.NAME] = `Population Group ${index}`;
      return returnObj;
    });
  }

  protected populateValues(): void {
    void super.populateValues();

    this.id = this._getString(PopulationGroup.KEYS.ID);
    this.name = this._getString(PopulationGroup.KEYS.NAME);
  }
}
