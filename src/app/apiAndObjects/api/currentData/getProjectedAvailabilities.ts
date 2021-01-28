import { HttpClient } from '@angular/common/http';
import { projectedAvailabilities } from '../../objects/projectedAvailabilities';
import { projectedAvailability } from '../../objects/projectedAvailability';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetProjectedAvailabilities extends CacheableEndpoint<
  projectedAvailabilities,
  GetProjectedAvailabilityParams
> {
  protected getCacheKey(params: GetProjectedAvailabilityParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetProjectedAvailabilityParams,
  Promise<projectedAvailabilities> {
    const callResponsePromise = this.apiCaller.doCall('projection-total', RequestMethod.GET, {
      // 'country-or-group-id': params.countryOrGroupId,
      // 'micronutrient-id': params.micronutrientId,
      // 'poulationGroup-id': params.poulationGroupId,
    });

    return this.buildObjectFromResponse(projectedAvailabilities, callResponsePromise);
  }

  protected callMock(): // params: GetProjectedAvailabilityParams,
  Promise<projectedAvailabilities> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      projectedAvailabilities,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('https://api.micronutrient.support/projection-total').toPromise());
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
