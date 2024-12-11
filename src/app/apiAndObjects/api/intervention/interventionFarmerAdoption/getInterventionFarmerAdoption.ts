import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionFarmerAdoption } from 'src/app/apiAndObjects/objects/interventionFarmerAdoption';

export class GetInterventionFarmerAdoption extends CacheableEndpoint<
  InterventionFarmerAdoption,
  GetInverventionsParams,
  InterventionFarmerAdoption
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionFarmerAdoption> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'farmer-adoption'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionFarmerAdoption, callResponsePromise);
  }

  protected callMock(): Promise<InterventionFarmerAdoption> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
