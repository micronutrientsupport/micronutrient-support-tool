import { InterventionFarmerAdoptionAF } from 'src/app/apiAndObjects/objects/interventionFarmerAdoptionAF';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionFarmerAdoptionAF extends CacheableEndpoint<
  InterventionFarmerAdoptionAF,
  GetInverventionsParams,
  InterventionFarmerAdoptionAF
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionFarmerAdoptionAF> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'farmer-adoption-af'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionFarmerAdoptionAF, callResponsePromise);
  }

  protected callMock(): Promise<InterventionFarmerAdoptionAF> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
