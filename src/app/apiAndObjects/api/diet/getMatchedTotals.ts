/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
import { MatchedTotals } from '../../objects/matchedTotals';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MnAvailabilityEndpointHelper } from './mnAvailabilityEndpointHelper';

export class GetMatchedTotals extends CacheableEndpoint<Array<MatchedTotals>, GetMatchedTotalsParams, MatchedTotals> {
  protected getCacheKey(params: GetMatchedTotalsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetMatchedTotalsParams): Promise<Array<MatchedTotals>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', MnAvailabilityEndpointHelper.getDataLevelSegment(params.dataSource), 'matched-totals'],
      RequestMethod.GET,
      {
        compositionDataId: params.dataSource.compositionDataId,
        consumptionDataId: params.dataSource.consumptionDataId,
        micronutrientId: params.micronutrient.id,
      },
      null,
    );

    return this.buildObjectsFromResponse(MatchedTotals, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetMatchedTotalsParams): Promise<Array<MatchedTotals>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      MnAvailabilityEndpointHelper.getObjectType(params.dataSource),
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(lastValueFrom(httpClient.get('/assets/exampleData/mn_availability.json')));
        }, 1500);
      }),
    );
  }
}

export interface GetMatchedTotalsParams {
  dataSource: DietDataSource;
  micronutrient: MicronutrientDictionaryItem;
}
