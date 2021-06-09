import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { DietChangeFoodItem } from '../../objects/dietChangeFoodItem';
import { FoodItemChangeItem } from '../../objects/dietaryChange.item';

export class GetDietChangeFoodItem extends CacheableEndpoint<DietChangeFoodItem, GetDietChangeFoodItemParams> {
  protected getCacheKey(params: GetDietChangeFoodItemParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeFoodItemParams,
  Promise<DietChangeFoodItem> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<DietChangeFoodItem> {
    throw new Error('Method not implemented.');
  }
}

export interface GetDietChangeFoodItemParams {
  dataSource: DataSource;
  changeItems: Array<FoodItemChangeItem>;
}
