import { BaseObject } from '../_lib_code/objects/baseObject';

export class MicronutrientDataOption extends BaseObject {
  public static readonly KEYS = {
    ID: 'id',
    NAME: 'name',
  };

  public id: string;
  public name: string;

  public static makeItemFromObject(source: Record<string, unknown>): MicronutrientDataOption {
    return super.makeItemFromObject(source) as MicronutrientDataOption;
  }

  public static createMockItems(count: number): Array<Record<string, unknown>> {
    return new Array(count).fill(null).map((val, index: number) => {
      const returnObj = {};
      returnObj[MicronutrientDataOption.KEYS.ID] = `${index}`;
      returnObj[MicronutrientDataOption.KEYS.NAME] = `Micronutrient data option ${index}`;
      return returnObj;
    });
  }

  protected populateValues(): void {
    void super.populateValues();

    this.id = this._getString(MicronutrientDataOption.KEYS.ID);
    this.name = this._getString(MicronutrientDataOption.KEYS.NAME);
  }
}
