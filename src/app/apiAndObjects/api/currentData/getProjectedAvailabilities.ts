import { HttpClient } from '@angular/common/http';
import { ProjectedAvailabilities } from '../../objects/projectedAvailabilities';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetProjectedAvailabilities extends CacheableEndpoint<
ProjectedAvailabilities,
GetProjectedAvailabilityParams
> {
  protected getCacheKey(params: GetProjectedAvailabilityParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetProjectedAvailabilityParams,
    Promise<ProjectedAvailabilities> {
    const callResponsePromise = this.apiCaller.doCall('projection-total', RequestMethod.GET, {
      // 'country-or-group-id': params.countryOrGroupId,
      // 'micronutrient-id': params.micronutrientId,
      // 'poulationGroup-id': params.poulationGroupId,
    });

    return this.buildObjectFromResponse(ProjectedAvailabilities, callResponsePromise);
  }

  protected callMock(): // params: GetProjectedAvailabilityParams,
    Promise<ProjectedAvailabilities> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      ProjectedAvailabilities,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/projection-total.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetProjectedAvailabilityParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
