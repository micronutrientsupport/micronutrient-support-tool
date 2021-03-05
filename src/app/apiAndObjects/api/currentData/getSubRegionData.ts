/* tslint:disable: no-string-literal */
import { HttpClient } from '@angular/common/http';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
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
      }).then((data: Array<Record<string, unknown>>) => {
        if (null != data) {
          // find Karonga (north-east region) element and randonly change the display values so that the display changes a little
          // eslint-disable-next-line @typescript-eslint/dot-notation
          const element = data.find(item => item[SubRegionDataItem.KEYS.ID] === 8);
          if (null != element) {
            element[SubRegionDataItem.KEYS.MN_ABSOLUTE] = Math.floor(Math.random() * 1800);
            element[SubRegionDataItem.KEYS.MN_THRESHOLD] = Math.floor(Math.random() * 100);
          }
        }
        return data;
      }),
    );
  }
}

export interface GetSubRegionDataParams {
  countryOrGroupId: string;
  micronutrients: Array<MicronutrientDictionaryItem>;
  mndsDataId: string;
}
