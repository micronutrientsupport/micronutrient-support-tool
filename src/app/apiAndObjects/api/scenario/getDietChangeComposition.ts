import { DataSource } from '../../objects/dataSource';
import { CompositionChangeItem } from '../../objects/dietaryChange.item';
import { HttpClient } from '@angular/common/http';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';

export class GetDietChangeComposition extends Endpoint<SubRegionDataItem, GetDietChangeCompositionParams> {
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
      }).then((data) => {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/dot-notation
        data[0]['geojson']['features'].forEach((feature) => {
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/dot-notation
          feature['properties']['mn_absolute'] = feature['properties']['mn_absolute'] * 1.1;
        });
        return data;
      }),
    );
  }
}

export interface GetDietChangeCompositionParams {
  dataSource: DataSource;
  changeItems: Array<CompositionChangeItem>;
}
