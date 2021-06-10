import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { DataSource } from '../../objects/dataSource';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../../objects/currentConsumption';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';

export class GetCurrentConsumption extends Endpoint<CurrentConsumption, GetCurrentConsumptionParams> {
  protected callLive(params: GetCurrentConsumptionParams): Promise<CurrentConsumption> {
    throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(['diet', 'scenario', 'consumption'], RequestMethod.GET, {
      foodItem: params.foodItem.id,
      consumptionDataId: params.dataSource.consumptionDataId,
    });

    return this.buildObjectFromResponse(CurrentConsumption, callResponsePromise);
  }

  protected callMock(): Promise<CurrentConsumption> {
    return this.buildObjectFromResponse(
      CurrentConsumption,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          const obj = {};
          obj[CurrentConsumption.KEYS.VALUE] = Math.round(Math.random() * 60);
          obj[CurrentConsumption.KEYS.UNITS] = 'ml/AME/day';
          resolve(obj);
        }, 1500);
      }),
    );
  }
}

export interface GetCurrentConsumptionParams {
  dataSource: DataSource;
  foodItem: FoodDictionaryItem;
}
