import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { ConsumptionChangeItem } from '../../objects/dietaryChange.item';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';

export class GetDietChangeConsumption extends CacheableEndpoint<SubRegionDataItem, GetDietChangeConsumptionParams> {
  protected getCacheKey(params: GetDietChangeConsumptionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeConsumptionParams,
  Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }
}

export interface GetDietChangeConsumptionParams {
  dataSource: DataSource;
  changeItems: Array<ConsumptionChangeItem>;
}
