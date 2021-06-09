import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { FoodItemChangeItem } from '../../objects/dietaryChange.item';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';

export class GetDietChangeFoodItem extends CacheableEndpoint<SubRegionDataItem, GetDietChangeFoodItemParams> {
  protected getCacheKey(params: GetDietChangeFoodItemParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeFoodItemParams,
  Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }
}

export interface GetDietChangeFoodItemParams {
  dataSource: DataSource;
  changeItems: Array<FoodItemChangeItem>;
}
