import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class TopFoodSource extends BaseObject implements Exportable {
  public static readonly KEYS = {
    FOOD_NAME: 'foodName',
    VALUE: 'mnConsumedPerDay',
  };

  public readonly foodName: string;
  public readonly value: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.foodName = this._getString(TopFoodSource.KEYS.FOOD_NAME);
    this.value = this._getNumber(TopFoodSource.KEYS.VALUE);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'Top20FoodItemsData';
  }
}
