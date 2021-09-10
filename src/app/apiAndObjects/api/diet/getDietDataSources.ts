import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';

export class GetDietDataSources extends CacheableEndpoint<
  Array<DietDataSource>,
  GetDietDataSourcesParams,
  DietDataSource
> {
  protected getCacheKey(params: GetDietDataSourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetDietDataSourcesParams): Promise<Array<DietDataSource>> {
    const callResponsePromise = this.apiCaller
      .doCall(['diet', 'data-sources'], RequestMethod.GET, {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
      })
      .then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(DietDataSource, callResponsePromise);
  }

  protected callMock(): Promise<DietDataSource[]> {
    throw new Error('Method not implemented.');
  }

  private processResponseData(
    data: Array<Record<string, unknown>>,
    params: GetDietDataSourcesParams,
  ): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => (item.id = String(index).valueOf()));
    // return only first item when single option specified
    return true === params.singleOptionOnly ? data.slice(0, 1) : data;
  }
}

export interface GetDietDataSourcesParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  singleOptionOnly?: boolean;
}
