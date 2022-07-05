import { InterventionData } from '../../../objects/interventionData';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionData extends CacheableEndpoint<InterventionData, GetInverventionsParams, InterventionData> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionData> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id, 'data'], RequestMethod.GET);

    return this.buildObjectFromResponse(InterventionData, callResponsePromise);
  }

  protected callMock(): Promise<InterventionData> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
