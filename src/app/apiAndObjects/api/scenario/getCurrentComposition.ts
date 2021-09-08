import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentComposition } from '../../objects/currentComposition';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { DietDataSource } from '../../objects/dietDataSource';

export class GetCurrentComposition extends Endpoint<CurrentComposition, GetCurrentCompositionParams> {
  protected callLive(params: GetCurrentCompositionParams): Promise<CurrentComposition> {
    throw new Error('Method not implemented.');
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
  dataSource: DietDataSource;
  foodItem: FoodDictionaryItem;
}
