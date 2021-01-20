import { HttpClient } from '@angular/common/http';
import { MonthlyFoodGroups } from '../../objects/monthlyFoodGroups';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetMonthlyFoodGroups extends CacheableEndpoint<
MonthlyFoodGroups,
GetMonthlyFoodGroupsParams
> {

  protected getCacheKey(params: GetMonthlyFoodGroupsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<MonthlyFoodGroups> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(HouseholdHistogramData, callResponsePromise);
  }

  protected callMock(
  // params: GetBaselineDataParams,
  ): Promise<MonthlyFoodGroups> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return this.buildObjectFromResponse(
      MonthlyFoodGroups,
      httpClient.get('/assets/exampleData/monthly-food-groups.json').toPromise(),
    );
  }
}

export interface GetMonthlyFoodGroupsParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
