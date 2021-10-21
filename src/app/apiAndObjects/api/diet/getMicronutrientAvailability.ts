/* tslint:disable: no-string-literal */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MnAvailabilityEndpointHelper, MN_AVAILABILITY_TYPE } from './mnAvailabilityEndpointHelper';

export class GetMicronutrientAvailability extends CacheableEndpoint<
  Array<MN_AVAILABILITY_TYPE>,
  GetMicronutrientAvailabilityParams,
  MN_AVAILABILITY_TYPE
> {
  protected getCacheKey(params: GetMicronutrientAvailabilityParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetMicronutrientAvailabilityParams): Promise<Array<MN_AVAILABILITY_TYPE>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', MnAvailabilityEndpointHelper.getDataLevelSegment(params.dataSource), 'availability'],
      RequestMethod.GET,
      {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
        compositionDataId: params.dataSource.compositionDataId,
        consumptionDataId: params.dataSource.consumptionDataId,
      },
      null,
      (headers: HttpHeaders) => (params.asGeoJson ? headers.set('Accept', 'application/geo-json') : headers),
    );

    return this.buildObjectsFromResponse(
      MnAvailabilityEndpointHelper.getObjectType(params.dataSource),
      callResponsePromise,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetMicronutrientAvailabilityParams): Promise<Array<MN_AVAILABILITY_TYPE>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      MnAvailabilityEndpointHelper.getObjectType(params.dataSource),
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/mn_availability.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetMicronutrientAvailabilityParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  dataSource: DietDataSource;
  asGeoJson: boolean;
}
