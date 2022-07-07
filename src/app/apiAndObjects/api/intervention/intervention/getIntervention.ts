import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';

export class GetIntervention extends CacheableEndpoint<InterventionsDictionaryItem, GetInverventionsParams, InterventionsDictionaryItem> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionsDictionaryItem> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id], RequestMethod.GET);

    return this.buildObjectFromResponse(InterventionsDictionaryItem, callResponsePromise);
  }

  protected callMock(): Promise<InterventionsDictionaryItem> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
