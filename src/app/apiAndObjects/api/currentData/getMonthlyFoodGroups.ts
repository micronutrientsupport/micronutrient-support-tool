/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
import { MonthlyFoodGroups } from '../../objects/monthlyFoodGroups';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';

export class GetMonthlyFoodGroups extends CacheableEndpoint<MonthlyFoodGroups, GetMonthlyFoodGroupsParams> {
  protected getCacheKey(params: GetMonthlyFoodGroupsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetMonthlyFoodGroupsParams,
  Promise<MonthlyFoodGroups> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectFromResponse(MonthlyFoodGroups, callResponsePromise);
  }

  protected callMock(): // params: GetMonthlyFoodGroupsParams,
  Promise<MonthlyFoodGroups> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      MonthlyFoodGroups,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/monthly-food-groups.json').toPromise());
        }, 1500);
      }).then((data: Record<string, unknown>) => {
        if (null != data) {
          // change something so that the display changes a little
          // eslint-disable-next-line @typescript-eslint/dot-notation
          data.jan['mn_cereal_grains_perc'] = Math.floor(Math.random() * 40);
        }
        return data;
      }),
    );
  }
}

export interface GetMonthlyFoodGroupsParams {
  countryOrGroup: CountryDictionaryItem;
  micronutrients: Array<MicronutrientDictionaryItem>;
  dataSource: DietDataSource;
}
