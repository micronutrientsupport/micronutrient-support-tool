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

  protected callLive(
  // params: GetMonthlyFoodGroupsParams,
  ): Promise<MonthlyFoodGroups> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectFromResponse(MonthlyFoodGroups, callResponsePromise);
  }

  protected callMock(
  // params: GetMonthlyFoodGroupsParams,
  ): Promise<MonthlyFoodGroups> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      MonthlyFoodGroups,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/monthly-food-groups.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetMonthlyFoodGroupsParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
