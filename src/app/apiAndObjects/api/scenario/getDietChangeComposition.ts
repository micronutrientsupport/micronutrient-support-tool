import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { CompositionChangeItem } from '../../objects/dietaryChange.item';
import { HttpClient } from '@angular/common/http';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';

export class GetDietChangeComposition extends CacheableEndpoint<SubRegionDataItem, GetDietChangeCompositionParams> {
  protected getCacheKey(params: GetDietChangeCompositionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeCompositionParams,
  Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<SubRegionDataItem> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      SubRegionDataItem,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/sub-region-results.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetDietChangeCompositionParams {
  dataSource: DataSource;
  changeItems: Array<CompositionChangeItem>;
}
