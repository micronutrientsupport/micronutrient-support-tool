/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
import { MonthlyFoodGroup } from '../../objects/monthlyFoodGroup';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetMonthlyFoodGroups extends CacheableEndpoint<
  Array<MonthlyFoodGroup>,
  GetMonthlyFoodGroupsParams,
  MonthlyFoodGroup
> {
  protected getCacheKey(params: GetMonthlyFoodGroupsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetMonthlyFoodGroupsParams): Promise<Array<MonthlyFoodGroup>> {
    const callResponsePromise = this.apiCaller.doCall(['diet', 'household', 'monthly'], RequestMethod.GET, {
      micronutrientId: params.micronutrient.id,
      compositionDataId: params.dataSource.compositionDataId,
      consumptionDataId: params.dataSource.consumptionDataId,
    });

    return this.buildObjectsFromResponse(MonthlyFoodGroup, callResponsePromise);
  }

  protected callMock(): Promise<Array<MonthlyFoodGroup>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      MonthlyFoodGroup,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/monthly-food-groups.json')) as Promise<
              Array<MonthlyFoodGroup>
            >,
          );
        }, 1500);
      }).then((data: Record<string, unknown>) => {
        if (null != data) {
          // change something so that the display changes a little
          // eslint-disable-next-line @typescript-eslint/dot-notation
          data[0][MonthlyFoodGroup.KEYS.PERCENTAGE_MN_CONSUMED] = Math.floor(Math.random() * 40);
        }
        return data;
      }),
    );
  }
}

export interface GetMonthlyFoodGroupsParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  dataSource: DietDataSource;
}
