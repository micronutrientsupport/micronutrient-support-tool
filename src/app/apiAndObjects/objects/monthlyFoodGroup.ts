import { DictionaryType } from '../api/dictionaryType.enum';
import { BaseObjectRequiresDictionaries } from '../_lib_code/objects/baseObjectRequiresDictionaries';
import { Dictionary } from '../_lib_code/objects/dictionary';
import { DictionaryItem } from '../_lib_code/objects/dictionaryItem.interface';
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

  public static readonly requiredDictionaryTypes: Array<DictionaryType> = [DictionaryType.FOOD_GROUPS];

  public readonly percentageConsumed: number;
  public readonly dietarySupply: number;
  public readonly month: Month;
  public readonly foodGroup: DictionaryItem;
  public readonly foodGroupId: string; // temporary, until food group dict live

  protected constructor(sourceObject?: Record<string, unknown>, dictionaries?: Array<Dictionary>) {
    super(sourceObject, dictionaries);

    this.percentageConsumed = this._getNumber(MonthlyFoodGroup.KEYS.PERCENTAGE_MN_CONSUMED);
    this.dietarySupply = this._getNumber(MonthlyFoodGroup.KEYS.DIETARY_SUPPLY);
    this.month = new Month(this._getNumber(MonthlyFoodGroup.KEYS.MONTH_CONSUMED_INDEX));
    // enable when  food group dict live
    // this.foodGroup = this._getDictionaryItem(DictionaryType.FOOD_GROUPS, MonthlyFoodGroup.KEYS.FOOD_GROUP_ID);

    this.foodGroupId = this._getString(MonthlyFoodGroup.KEYS.FOOD_GROUP_ID);
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
