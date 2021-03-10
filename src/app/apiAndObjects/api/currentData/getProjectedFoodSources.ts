import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { ProjectedFoodSourcesData } from '../../objects/projectedFoodSources';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectedFoodSourcesData extends CacheableEndpoint<
  Array<ProjectedFoodSourcesData>,
  GetProjectedFoodSourcesParams,
  ProjectedFoodSourcesData
> {
  protected getCacheKey(params: GetProjectedFoodSourcesParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetProjectedFoodSourcesParams): Promise<Array<ProjectedFoodSourcesData>> {
    const grouoCallReplacement = params.commodityOrFoodGroup === 'commodity' ? 'commodity' : 'food-group';
    const callResponsePromise = this.apiCaller.doCall(
      ['projections', grouoCallReplacement, params.countryOrGroup.id, params.micronutrients[0].id, params.scenarioId],
      RequestMethod.GET,
    );
    return this.buildObjectsFromResponse(ProjectedFoodSourcesData, callResponsePromise);
  }

  protected callMock(): Promise<Array<ProjectedFoodSourcesData>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ProjectedFoodSourcesData,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/impact_commodity_aggregation.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetProjectedFoodSourcesParams {
  commodityOrFoodGroup: string;
  countryOrGroup: CountryDictionaryItem;
  micronutrients: Array<MicronutrientDictionaryItem>;
  scenarioId: string;
}
