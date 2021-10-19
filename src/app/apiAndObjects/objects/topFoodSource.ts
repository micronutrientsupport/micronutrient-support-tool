import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class TopFoodSource extends BaseObject implements Exportable {
  public static readonly KEYS = {
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_DATA_ID: 'compositionDataId',
    MICRONUTRIENT_ID: 'micronutrientId',
    DAILY_MN_CONTRIBUTION: 'dailyMnContribution',
    FOOD_GROUP_ID: 'foodGroupId',
    FOOD_GROUP_NAME: 'foodGroupName',
    FOOD_GENUS_ID: 'foodGenusId',
    FOOD_GENUS_NAME: 'foodGenusName',
    RANKING: 'ranking',
  };

  public readonly dailyMnContribution: number;
  public readonly ranking: number;
  public readonly foodGroupName: string;
  public readonly foodGenusName: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.dailyMnContribution = this._getNumber(TopFoodSource.KEYS.DAILY_MN_CONTRIBUTION);
    this.ranking = this._getNumber(TopFoodSource.KEYS.RANKING);
    this.foodGroupName = this._getString(TopFoodSource.KEYS.FOOD_GROUP_NAME);
    this.foodGenusName = this._getString(TopFoodSource.KEYS.FOOD_GENUS_NAME);
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
