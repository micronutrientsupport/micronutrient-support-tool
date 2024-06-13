import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionExpectedLosses } from 'src/app/apiAndObjects/objects/interventionExpectedLosses';

export class GetInterventionExpectedLosses extends CacheableEndpoint<
  InterventionExpectedLosses,
  GetInverventionsParams,
  InterventionExpectedLosses
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionExpectedLosses> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'expected-losses'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionExpectedLosses, callResponsePromise);
  }

  protected callMock(): Promise<InterventionExpectedLosses> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
