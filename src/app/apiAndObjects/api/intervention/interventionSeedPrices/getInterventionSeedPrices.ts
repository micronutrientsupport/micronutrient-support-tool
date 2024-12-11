import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionSeedPrices } from 'src/app/apiAndObjects/objects/interventionSeedPrices';

export class GetInterventionSeedPrices extends CacheableEndpoint<
  InterventionSeedPrices,
  GetInverventionsParams,
  InterventionSeedPrices
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionSeedPrices> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id, 'seed-prices'], RequestMethod.GET);

    return this.buildObjectFromResponse(InterventionSeedPrices, callResponsePromise);
  }

  protected callMock(): Promise<InterventionSeedPrices> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
