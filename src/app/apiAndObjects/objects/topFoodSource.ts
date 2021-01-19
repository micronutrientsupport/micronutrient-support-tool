import { BaseObject } from '../_lib_code/objects/baseObject';

export class TopFoodSource extends BaseObject {
  public static readonly KEYS = {
    POULTRY: 'Poultry',
  };

  public poultry: string;
  // public value: number;

  public static makeItemFromObject(source: Record<string, unknown>): TopFoodSource {
    // console.log(super.makeItemFromObject(source) as TopFoodSource);
    // console.log('SAUCE: ', source);
    return super.makeItemFromObject(source) as TopFoodSource;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.poultry = this._getString(TopFoodSource.KEYS.POULTRY);
    // this.name = this._getString(TopFoodSource.KEYS.NAME);
  }
}
