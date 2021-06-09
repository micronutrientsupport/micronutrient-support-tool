import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { DietChangeConsumption } from '../../objects/dietChangeConsumption';
import { ConsumptionChangeItem } from '../../objects/dietaryChange.item';

export class GetDietChangeConsumption extends CacheableEndpoint<DietChangeConsumption, GetDietChangeConsumptionParams> {
  protected getCacheKey(params: GetDietChangeConsumptionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeConsumptionParams,
  Promise<DietChangeConsumption> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<DietChangeConsumption> {
    throw new Error('Method not implemented.');
  }
}

export interface GetDietChangeConsumptionParams {
  dataSource: DataSource;
  changeItems: Array<ConsumptionChangeItem>;
}
