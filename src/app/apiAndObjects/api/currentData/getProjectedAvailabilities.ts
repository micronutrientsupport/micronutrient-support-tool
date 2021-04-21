import { HttpClient } from '@angular/common/http';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { ProjectedAvailability } from '../../objects/projectedAvailability';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DataSource } from '../../objects/dataSource';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';

export class GetProjectedAvailabilities extends CacheableEndpoint<
  Array<ProjectedAvailability>,
  GetProjectedAvailabilityParams,
  ProjectedAvailability
> {
  protected getCacheKey(params: GetProjectedAvailabilityParams): string {
    return JSON.stringify(params);
  }

  protected callLive(
  // params: GetProjectedAvailabilityParams,
  ): Promise<Array<ProjectedAvailability>> {
    const callResponsePromise = this.apiCaller.doCall('projection-total', RequestMethod.GET, {
      // 'country-or-group-id': params.countryOrGroupId,
      // 'micronutrient-id': params.micronutrientId,
      // 'poulationGroup-id': params.poulationGroupId,
    });

    return this.buildObjectsFromResponse(ProjectedAvailability, callResponsePromise);
  }

  protected callMock(
  // params: GetProjectedAvailabilityParams,
  ): Promise<Array<ProjectedAvailability>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ProjectedAvailability,
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
  countryOrGroup: CountryDictionaryItem;
  micronutrients: Array<MicronutrientDictionaryItem>;
  dataSource: DataSource;
}
