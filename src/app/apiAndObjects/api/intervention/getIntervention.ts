/* tslint:disable: no-string-literal */
import { Intervention } from '../../objects/intervention';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetIntervention extends CacheableEndpoint<Intervention, GetInverventionsParams, Intervention> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<Intervention> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id], RequestMethod.GET);

    return this.buildObjectFromResponse(Intervention, callResponsePromise);
  }

  protected callMock(): Promise<Intervention> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
