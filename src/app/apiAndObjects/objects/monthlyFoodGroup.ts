import { BaseObjectRequiresDictionaries } from '../_lib_code/objects/baseObjectRequiresDictionaries';
import { Exportable } from './exportable.interface';
import { Month } from './month';

export class MonthlyFoodGroup extends BaseObjectRequiresDictionaries implements Exportable {
  public static readonly KEYS = {
    PERCENTAGE_MN_CONSUMED: 'percentageMnConsumed',
    MICRONUTRIENT_ID: 'micronutrientId',
    DIETARY_SUPPLY: 'dietarySupply',
    MONTH_CONSUMED_INDEX: 'monthConsumed',
    FOOD_GROUP_ID: 'foodGroupId',
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_DATA_ID: 'compositionDataId',
  };

  public readonly percentageConsumed: number;
  public readonly dietarySupply: number;
  public readonly month: Month;
  public readonly group: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.percentageConsumed = this._getNumber(MonthlyFoodGroup.KEYS.PERCENTAGE_MN_CONSUMED);
    this.dietarySupply = this._getNumber(MonthlyFoodGroup.KEYS.DIETARY_SUPPLY);
    this.month = new Month(this._getNumber(MonthlyFoodGroup.KEYS.MONTH_CONSUMED_INDEX));
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'MonthlyFoodData';
  }
}
