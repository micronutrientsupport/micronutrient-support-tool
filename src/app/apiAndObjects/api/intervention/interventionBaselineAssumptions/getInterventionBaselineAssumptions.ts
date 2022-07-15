import { InterventionBaselineAssumptions } from '../../../objects/interventionBaselineAssumptions';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionBaselineAssumptions extends CacheableEndpoint<
  InterventionBaselineAssumptions,
  GetInverventionsParams,
  InterventionBaselineAssumptions
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionBaselineAssumptions> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'baseline-assumptions'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionBaselineAssumptions, callResponsePromise);
  }

  protected callMock(): Promise<InterventionBaselineAssumptions> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
