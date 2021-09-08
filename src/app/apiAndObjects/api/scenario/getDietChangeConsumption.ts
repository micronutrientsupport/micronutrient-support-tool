import { ConsumptionChangeItem } from '../../objects/dietaryChange.item';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { HttpClient } from '@angular/common/http';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { DietDataSource } from '../../objects/dietDataSource';

export class GetDietChangeConsumption extends Endpoint<SubRegionDataItem, GetDietChangeConsumptionParams> {
  protected callLive(): // params: GetDietChangeConsumptionParams,
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
          feature['properties']['mn_absolute'] = feature['properties']['mn_absolute'] * 1.2;
        });
        return data;
      }),
    );
  }
}

export interface GetDietChangeConsumptionParams {
  dataSource: DietDataSource;
  changeItems: Array<ConsumptionChangeItem>;
}
