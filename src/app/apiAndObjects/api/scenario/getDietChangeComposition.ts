import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { DataSource } from '../../objects/dataSource';
import { DietChangeComposition } from '../../objects/dietChangeComposition';
import { CompositionChangeItem } from '../../objects/dietaryChange.item';

export class GetDietChangeComposition extends CacheableEndpoint<DietChangeComposition, GetDietChangeCompositionParams> {
  protected getCacheKey(params: GetDietChangeCompositionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): // params: GetDietChangeCompositionParams,
  Promise<DietChangeComposition> {
    throw new Error('Method not implemented.');
  }

  protected callMock(): Promise<DietChangeComposition> {
    throw new Error('Method not implemented.');
  }
}

export interface GetDietChangeCompositionParams {
  dataSource: DataSource;
  changeItems: Array<CompositionChangeItem>;
}
