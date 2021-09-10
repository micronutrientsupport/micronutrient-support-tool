import { HttpClient } from '@angular/common/http';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
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
        // params.country.id,
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
            httpClient
              .get('/assets/exampleData/top-foods.json')
              .toPromise()
              .then((objects: Array<Record<string, unknown>>) => {
                if (null != objects[0]) {
                  // change something so that the display changes a little
                  objects[0].value = Math.floor(Math.random() * 3);
                }
                return objects;
              }),
          );
        }, 1500);
      }),
    );
  }

  private getDataLevelSegment(dataSource: DietDataSource): string {
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
  dataSource: DietDataSource;
}
