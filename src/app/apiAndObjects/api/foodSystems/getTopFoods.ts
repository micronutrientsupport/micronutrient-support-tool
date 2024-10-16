import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { FoodSystemsDataSource } from '../../objects/foodSystemsDataSource';
import { DataLevel } from '../../objects/enums/dataLevel.enum';
import { TopFoodSource } from '../../objects/topFoodSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetTopFood extends CacheableEndpoint<Array<TopFoodSource>, TopFoodParams, TopFoodSource> {
  protected getCacheKey(params: TopFoodParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: TopFoodParams): Promise<Array<TopFoodSource>> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', this.getDataLevelSegment(params.dataSource), 'top-foods'],
      RequestMethod.GET,
      {
        micronutrientId: params.micronutrient.id,
        compositionDataId: params.dataSource.compositionDataId,
        consumptionDataId: params.dataSource.consumptionDataId,
      },
    );

    return this.buildObjectsFromResponse(TopFoodSource, callResponsePromise);
  }

  protected callMock(): Promise<Array<TopFoodSource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      TopFoodSource,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/top-foods.json')).then(
              (objects: Array<Record<string, unknown>>) => {
                if (null != objects[0]) {
                  // change something so that the display changes a little (multiply by 0.8 to 0.9)
                  (objects[0][TopFoodSource.KEYS.DAILY_MN_CONTRIBUTION] as number) *= Math.random() * 0.1 + 0.8;
                }
                return objects;
              },
            ),
          );
        }, 1500);
      }),
    );
  }

  private getDataLevelSegment(dataSource: FoodSystemsDataSource): string {
    switch (dataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return 'country';
      case DataLevel.HOUSEHOLD:
        return 'household';
    }
  }
}
export interface TopFoodParams {
  micronutrient: MicronutrientDictionaryItem;
  dataSource: FoodSystemsDataSource;
}
