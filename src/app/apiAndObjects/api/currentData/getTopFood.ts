/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { TopFoodSource } from '../../objects/topFoodSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetTopFood extends CacheableEndpoint<Array<TopFoodSource>, TopFoodParams, TopFoodSource> {
  protected getCacheKey(params: TopFoodParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
    params: TopFoodParams,
  ): Promise<Array<TopFoodSource>> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall([
      'country',
      'top20',
      params.countryOrGroupId,
      params.micronutrients[0].id,
      // compositionId,
      // consumptionId,
    ], RequestMethod.GET).then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(TopFoodSource, callResponsePromise);
  }

  protected callMock(
    // params: TopFoodParams,
  ): Promise<Array<TopFoodSource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      TopFoodSource,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            httpClient.get('/assets/exampleData/top-foods.json').toPromise()
              .then((objects: Array<Record<string, unknown>>) => {
                if (null != objects[0]) {
                  // change something so that the display changes a little
                  objects[0].value = Math.floor(Math.random() * 3);
                }
                return objects;
              })
          );
        }, 1500);
      }),
    );
  }

  private processResponseData(
    data: Array<Record<string, unknown>>,
    params: TopFoodParams,
  ): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => item.id = String(index).valueOf());
    // return only first item when single option specified
    return (params.countryOrGroupId, params.micronutrients[0].id) ? data.slice(0, 1) : data;
  }
}

export interface TopFoodParams {
  countryOrGroup: CountryDictionaryItem;
  micronutrients: Array<MicronutrientDictionaryItem>;
  // mndsDataId: string;
}
