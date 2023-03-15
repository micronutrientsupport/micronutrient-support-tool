import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { FoodSystemsDataSource } from '../../objects/foodSystemsDataSource';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export class GetFoodSystemsDataSources extends CacheableEndpoint<
  Array<FoodSystemsDataSource>,
  GetFoodSystemsDataSourcesParams,
  FoodSystemsDataSource
> {
  protected getCacheKey(params: GetFoodSystemsDataSourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetFoodSystemsDataSourcesParams): Promise<Array<FoodSystemsDataSource>> {
    const callResponsePromise = this.apiCaller
      .doCall(['diet', 'data-sources'], RequestMethod.GET, {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
      })
      .then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(FoodSystemsDataSource, callResponsePromise);
  }

  protected callMock(): Promise<FoodSystemsDataSource[]> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      FoodSystemsDataSource,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(lastValueFrom(httpClient.get('/assets/exampleData/diet_datasources.json')));
        }, 1500);
      }),
    );
  }

  private processResponseData(
    data: Array<Record<string, unknown>>,
    params: GetFoodSystemsDataSourcesParams,
  ): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => (item.id = String(index).valueOf()));
    // return only first item when single option specified
    return true === params.singleOptionOnly ? data.slice(0, 1) : data;
  }
}

export interface GetFoodSystemsDataSourcesParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  singleOptionOnly?: boolean;
}
