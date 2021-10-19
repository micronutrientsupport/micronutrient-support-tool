import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { FoodDictionaryItem } from '../../objects/dictionaries/foodDictionaryItem';
import { CurrentConsumption } from '../../objects/currentConsumption';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { DietDataSource } from '../../objects/dietDataSource';
import { HttpClient } from '@angular/common/http';

export class GetCurrentConsumption extends Endpoint<CurrentConsumption, GetCurrentConsumptionParams> {
  protected callLive(params: GetCurrentConsumptionParams): Promise<CurrentConsumption> {
    const callResponsePromise = this.apiCaller.doCall(['food-consumption'], RequestMethod.GET, {
      foodGenusId: params.foodItem.id,
      consumptionDataId: params.dataSource.consumptionDataId,
    });

    return this.buildObjectFromResponse(CurrentConsumption, callResponsePromise);
  }

  protected callMock(): Promise<CurrentConsumption> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      CurrentConsumption,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/food_consumption.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetCurrentConsumptionParams {
  dataSource: DietDataSource;
  foodItem: FoodDictionaryItem;
}
