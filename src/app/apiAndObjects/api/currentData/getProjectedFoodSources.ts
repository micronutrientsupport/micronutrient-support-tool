import { HttpClient } from '@angular/common/http';
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
    const callResponsePromise = this.apiCaller.doCall(
      ['projections', 'commodity', params.countryOrGroupId, params.micronutrientId, params.scenarioId],
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
  countryOrGroupId: string;
  micronutrientId: string;
  scenarioId: string;
}
