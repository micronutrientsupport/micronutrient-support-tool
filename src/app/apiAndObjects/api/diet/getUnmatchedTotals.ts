/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { DietDataSource } from '../../objects/dietDataSource';
import { UnmatchedTotals } from '../../objects/unmatchedTotals';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MnAvailabilityEndpointHelper } from './mnAvailabilityEndpointHelper';

export class GetUnmatchedTotals extends CacheableEndpoint<
  Array<UnmatchedTotals>,
  GetUnmatchedTotalsParams,
  UnmatchedTotals
> {
  protected getCacheKey(params: GetUnmatchedTotalsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetUnmatchedTotalsParams): Promise<Array<UnmatchedTotals>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', MnAvailabilityEndpointHelper.getDataLevelSegment(params.dataSource), 'unmatched-totals'],
      RequestMethod.GET,
      {
        compositionDataId: params.dataSource.compositionDataId,
        consumptionDataId: params.dataSource.consumptionDataId,
      },
      null,
    );

    return this.buildObjectsFromResponse(UnmatchedTotals, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetUnmatchedTotalsParams): Promise<Array<UnmatchedTotals>> {
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

export interface GetUnmatchedTotalsParams {
  dataSource: DietDataSource;
}
