import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { DataSource } from '../../objects/dataSource';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentComposition } from '../../objects/currentComposition';

export class GetCurrentComposition extends CacheableEndpoint<CurrentComposition, GetCurrentCompositionParams> {
  protected getCacheKey(params: GetCurrentCompositionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetCurrentCompositionParams): Promise<CurrentComposition> {
    const callResponsePromise = this.apiCaller.doCall(['diet', 'scenario', 'composition'], RequestMethod.GET, {
      foodItem: params.foodItem.id,
      compositionDataId: params.dataSource.compositionDataId,
    });

    return this.buildObjectFromResponse(CurrentComposition, callResponsePromise);
  }

  protected callMock(): Promise<CurrentComposition> {
    return this.buildObjectFromResponse(
      CurrentComposition,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          const obj = {};
          obj[CurrentComposition.KEYS.VALUE] = Math.round(Math.random() * 25);
          obj[CurrentComposition.KEYS.UNITS] = 'mg/kg';
          resolve(obj);
        }, 1500);
      }),
    );
  }
}

export interface GetCurrentCompositionParams {
  foodItem: FoodDictionaryItem;
  dataSource: DataSource;
}
