import { HttpClient } from '@angular/common/http';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
export class GetSubRegionData extends CacheableEndpoint<Array<SubRegionDataItem>, GetSubRegionDataParams, SubRegionDataItem> {
  protected getCacheKey(params: GetSubRegionDataParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<Array<SubRegionDataItem>> { // params: GetSubRegionDataParams,
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(SubRegionDataItem, callResponsePromise);
  }

  protected callMock(): Promise<Array<SubRegionDataItem>> { // params: GetSubRegionDataParams,
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      SubRegionDataItem,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/sub-region-results_original.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetSubRegionDataParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
