import { HttpClient } from '@angular/common/http';
import { TopFoodSource } from '../../objects/topFoodSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetTopFood extends CacheableEndpoint<Array<TopFoodSource>, TopFoodParams, TopFoodSource> {
  protected getCacheKey(params: TopFoodParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
  // params: TopFoodParams,
  ): Promise<Array<TopFoodSource>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(TopFoodSource, callResponsePromise);
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
          resolve(httpClient.get('/assets/exampleData/top-foods.json').toPromise());
        }, 1500);
      }),
    ).then((data: Array<TopFoodSource>) => {
      if (null != data[0]) {
        // change something so that the display changes a little
        data[0].value = Math.floor(Math.random() * 3);
      }
      return data;
    });
  }
}

export interface TopFoodParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  // mndsDataId: string;
}
