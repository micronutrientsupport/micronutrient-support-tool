import { BaseObject } from '../_lib_code/objects/baseObject';

export class TopFoodSource extends BaseObject {
  public static readonly KEYS = {
    FOODEX2_NAME: 'foodex2_name',
    VALUE: 'value',
  };

  public foodex2Name: string;
  public value: number;

  public static makeItemFromObject(source: Record<string, unknown>): TopFoodSource {
    return super.makeItemFromObject(source) as TopFoodSource;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.foodex2Name = this._getString(TopFoodSource.KEYS.FOODEX2_NAME);
    this.value = this._getNumber(TopFoodSource.KEYS.VALUE);
  }
}
