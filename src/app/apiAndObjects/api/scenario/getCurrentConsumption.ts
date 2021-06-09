import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { DataSource } from '../../objects/dataSource';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../../objects/currentConsumption';

export class GetCurrentConsumption extends CacheableEndpoint<CurrentConsumption, GetCurrentConsumptionParams> {
  protected getCacheKey(params: GetCurrentConsumptionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetCurrentConsumptionParams): Promise<CurrentConsumption> {
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
  foodItem: FoodDictionaryItem;
  dataSource: DataSource;
}
