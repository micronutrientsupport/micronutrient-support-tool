import { HttpClient } from '@angular/common/http';
import { ProjectedFoodSourcesData } from '../../objects/projectedFoodSources';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';

export class GetProjectedFoodSourcesData extends CacheableEndpoint<
  Array<ProjectedFoodSourcesData>,
  GetProjectedFoodSourcesParams,
  ProjectedFoodSourcesData
> {
  protected getCacheKey(params: GetProjectedFoodSourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<Array<ProjectedFoodSourcesData>> {
    throw new Error('Method not implemented.');
  }

  //   protected callMock(): // params: GetHouseholdHistogramDataParams,
  //   Promise<Array<ProjectedFoodSourcesData>> {
  //     const httpClient = this.injector.get<HttpClient>(HttpClient);
  //     return this.buildObjectFromResponse(
  //       ProjectedFoodSourcesData,
  //       // response after delay
  //       new Promise((resolve) => {
  //         setTimeout(() => {
  //           resolve(httpClient.get('/assets/exampleData/impact_commodity_aggregation.json').toPromise());
  //         }, 1500);
  //       }),
  //     );
  //   }
  // }

  protected callMock(): // params: GetProjectedAvailabilityParams,
  Promise<Array<ProjectedFoodSourcesData>> {
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
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
