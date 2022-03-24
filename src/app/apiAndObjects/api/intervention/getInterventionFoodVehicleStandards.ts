import { InterventionFoodVehicleStandards } from '../../objects/InterventionFoodVehicleStandards';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetInterventionFoodVehicleStandards extends CacheableEndpoint<
  InterventionFoodVehicleStandards,
  GetInverventionsParams,
  InterventionFoodVehicleStandards
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionFoodVehicleStandards> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'food-vehicle-standards'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionFoodVehicleStandards, callResponsePromise);
  }

  protected callMock(): Promise<InterventionFoodVehicleStandards> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
