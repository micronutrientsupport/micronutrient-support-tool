import { InterventionCostSummary } from '../../objects/InterventionCostSummary';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetInterventionCostSummary extends CacheableEndpoint<
  InterventionCostSummary,
  GetInverventionsParams,
  InterventionCostSummary
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionCostSummary> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id, 'cost-summary'], RequestMethod.GET);

    return this.buildObjectFromResponse(InterventionCostSummary, callResponsePromise);
  }

  protected callMock(): Promise<InterventionCostSummary> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
