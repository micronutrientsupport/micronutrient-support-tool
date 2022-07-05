import { InterventionRecurringCosts } from '../../../objects/interventionRecurringCosts';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionRecurringCosts extends CacheableEndpoint<
  InterventionRecurringCosts,
  GetInverventionsParams,
  InterventionRecurringCosts
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionRecurringCosts> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'recurring-costs'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionRecurringCosts, callResponsePromise);
  }

  protected callMock(): Promise<InterventionRecurringCosts> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
