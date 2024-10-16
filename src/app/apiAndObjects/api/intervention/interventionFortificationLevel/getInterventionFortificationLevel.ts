import { Endpoint } from 'src/app/apiAndObjects/_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionFortificantLevel } from 'src/app/apiAndObjects/objects/interventionFortificantLevel';

export class GetInterventionFortificationLevel extends Endpoint<
  InterventionFortificantLevel[],
  GetInverventionsParams,
  InterventionFortificantLevel
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionFortificantLevel[]> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id, 'premix-levels'], RequestMethod.GET);

    return this.buildObjectsFromResponse(InterventionFortificantLevel, callResponsePromise);
  }

  protected callMock(): Promise<InterventionFortificantLevel[]> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
