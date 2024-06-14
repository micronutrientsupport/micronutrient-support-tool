import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionCostEffectivenessSummary } from '../../../objects/interventionCostEffectivenessSummary';

export class GetInterventionCostEffectivenessSummary extends CacheableEndpoint<
  InterventionCostEffectivenessSummary,
  GetInverventionsParams,
  InterventionCostEffectivenessSummary
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionCostEffectivenessSummary> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'cost-effectiveness-summary'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionCostEffectivenessSummary, callResponsePromise);
  }

  protected callMock(): Promise<InterventionCostEffectivenessSummary> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
