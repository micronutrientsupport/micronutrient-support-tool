/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietaryHouseholdSummary } from '../../objects/dietaryHouseholdSummary';
import { DietDataSource } from '../../objects/dietDataSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetNationalSummary extends CacheableEndpoint<
  Array<DietaryHouseholdSummary>,
  GetNationalSummaryParams,
  DietaryHouseholdSummary
> {
  protected getCacheKey(params: GetNationalSummaryParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetNationalSummaryParams): Promise<Array<DietaryHouseholdSummary>> {
    const callResponsePromise = this.apiCaller.doCall(['diet', 'household', 'overview'], RequestMethod.GET, {
      micronutrientId: params.micronutrient.id,
      compositionDataId: params.dataSource.compositionDataId,
      consumptionDataId: params.dataSource.consumptionDataId,
    });

    return this.buildObjectsFromResponse(DietaryHouseholdSummary, callResponsePromise);
  }

  protected callMock(): Promise<Array<DietaryHouseholdSummary>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      DietaryHouseholdSummary,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/national_summary.json')) as Promise<
              Array<DietaryHouseholdSummary>
            >,
          );
        }, 1500);
      }).then((data: Array<Record<string, unknown>>) => {
        if (null != data) {
          // change something so that the display changes a little (multiply by 0.8 to 0.9)
          // eslint-disable-next-line @typescript-eslint/dot-notation
          (data[0][DietaryHouseholdSummary.KEYS.DEFICIENT_VALUE] as number) *= Math.random() * 0.1 + 0.8;
        }
        return data;
      }),
    );
  }
}

export interface GetNationalSummaryParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  dataSource: DietDataSource;
}
