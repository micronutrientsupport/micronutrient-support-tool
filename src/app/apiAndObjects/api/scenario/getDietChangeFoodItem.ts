import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { FoodItemChangeItem } from '../../objects/dietaryChange.item';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { HttpClient } from '@angular/common/http';

export class GetDietChangeFoodItem extends CacheableEndpoint<SubRegionDataItem, GetDietChangeFoodItemParams> {
  protected getCacheKey(params: GetDietChangeFoodItemParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeFoodItemParams,
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
      }).then((data) => {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/dot-notation
        data[0]['geojson']['features'].forEach((feature) => {
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/dot-notation
          feature['properties']['mn_absolute'] = feature['properties']['mn_absolute'] * 1.5;
        });
        return data;
      }),
    );
  }
}

export interface GetDietChangeFoodItemParams {
  dataSource: DataSource;
  changeItems: Array<FoodItemChangeItem>;
}
