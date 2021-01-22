import { HttpClient } from '@angular/common/http';
import { HouseholdHistogramData } from '../../objects/householdHistogramData';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetHouseholdHistogramData extends CacheableEndpoint<
Array<HouseholdHistogramData>,
GetHouseholdHistogramDataParams,
HouseholdHistogramData
> {

  protected getCacheKey(params: GetHouseholdHistogramDataParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
  // params: GetHouseholdHistogramDataParams,
  ): Promise<Array<HouseholdHistogramData>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(HouseholdHistogramData, callResponsePromise);
  }

  protected callMock(
  // params: GetHouseholdHistogramDataParams,
  ): Promise<Array<HouseholdHistogramData>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      HouseholdHistogramData,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/household_histogram.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetHouseholdHistogramDataParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
