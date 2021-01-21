import { HttpClient } from '@angular/common/http';
import { TopFoodSource } from '../../objects/topFoodSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetTopFood extends CacheableEndpoint<Array<TopFoodSource>, TopFoodParams, TopFoodSource> {
  protected getCacheKey(params: TopFoodParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<Array<TopFoodSource>> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<Array<TopFoodSource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return this.buildObjectsFromResponse(
      TopFoodSource,
      httpClient.get('/assets/exampleData/top-foods.json').toPromise(),
    );
  }
}

export interface TopFoodParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  // mndsDataId: string;
}
