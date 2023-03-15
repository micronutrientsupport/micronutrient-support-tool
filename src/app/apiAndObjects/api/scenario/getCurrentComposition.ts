import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentComposition } from '../../objects/currentComposition';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { FoodSystemsDataSource } from '../../objects/foodSystemsDataSource';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export class GetCurrentComposition extends Endpoint<CurrentComposition, GetCurrentCompositionParams> {
  protected callLive(params: GetCurrentCompositionParams): Promise<CurrentComposition> {
    const callResponsePromise = this.apiCaller.doCall(['food-composition'], RequestMethod.GET, {
      foodGenusId: params.foodItem.id,
      compositionDataId: params.dataSource.compositionDataId,
      micronutrientId: params.micronutrient.id,
    });

    return this.buildObjectFromResponse(CurrentComposition, callResponsePromise);
  }

  protected callMock(): Promise<CurrentComposition> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      CurrentComposition,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/food_composition.json')) as Promise<CurrentComposition>,
          );
        }, 1500);
      }),
    );
  }
}

export interface GetCurrentCompositionParams {
  dataSource: FoodSystemsDataSource;
  foodItem: FoodDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
}
