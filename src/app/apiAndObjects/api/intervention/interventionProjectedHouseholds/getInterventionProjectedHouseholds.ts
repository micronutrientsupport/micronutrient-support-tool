import { InterventionProjectedHouseholds } from '../../../objects/interventionProjectedHouseholds';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionProjectedHouseholds extends CacheableEndpoint<
  Array<InterventionProjectedHouseholds>,
  GetInverventionsParams,
  InterventionProjectedHouseholds
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionProjectedHouseholds[]> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'projected-households'],
      RequestMethod.GET,
    );

    return this.buildObjectsFromResponse(InterventionProjectedHouseholds, callResponsePromise);
  }

  protected callMock(): Promise<InterventionProjectedHouseholds[]> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
