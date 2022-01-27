import { InterventionStartupCosts } from '../../objects/interventionStartupCosts';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetInterventionStartupCosts extends CacheableEndpoint<
  InterventionStartupCosts,
  GetInverventionsParams,
  InterventionStartupCosts
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionStartupCosts> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'startup-scaleup-costs'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionStartupCosts, callResponsePromise);
  }

  protected callMock(): Promise<InterventionStartupCosts> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
