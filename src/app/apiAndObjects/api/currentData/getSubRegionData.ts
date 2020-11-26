import { HttpClient } from '@angular/common/http';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetSubRegionData extends CacheableEndpoint<
Array<SubRegionDataItem>,
GetSubRegionDataParams,
SubRegionDataItem
> {

  protected getCacheKey(params: GetSubRegionDataParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<Array<SubRegionDataItem>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(SubRegionDataItem, callResponsePromise);
  }

  protected callMock(
  // params: GetBaselineDataParams,
  ): Promise<Array<SubRegionDataItem>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return this.buildObjectsFromResponse(
      SubRegionDataItem,
      httpClient.get('/assets/exampleData/sub-region-results.json').toPromise(),
    );
  }
}

export interface GetSubRegionDataParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  mndsDataId: string;
}
