import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionIntakeThreshold } from 'src/app/apiAndObjects/objects/interventionIntakeThreshold';

export class GetInterventionIntakeThreshold extends CacheableEndpoint<
  Array<InterventionIntakeThreshold>,
  GetInverventionsParams,
  InterventionIntakeThreshold
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionIntakeThreshold[]> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'intake-thresholds'],
      RequestMethod.GET,
    );

    return this.buildObjectsFromResponse(InterventionIntakeThreshold, callResponsePromise);
  }

  protected callMock(): Promise<InterventionIntakeThreshold[]> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
