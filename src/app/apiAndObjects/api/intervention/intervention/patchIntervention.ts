import { Intervention } from '../../../objects/intervention';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { HttpHeaders } from '@angular/common/http';

export class PatchIntervention extends CacheableEndpoint<Intervention, GetInverventionsParams, Intervention> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<Intervention> {
    const activeUser = this.getActiveUser();
    const headers = (): HttpHeaders => {
      let authHeader = new HttpHeaders();
      authHeader = authHeader.append('X-Session-Token', activeUser ? activeUser.sessionToken : '');
      return authHeader;
    };
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id],
      RequestMethod.PATCH,
      null,
      {},
      headers,
    );

    return this.buildObjectFromResponse(Intervention, callResponsePromise);
  }

  protected callMock(): Promise<Intervention> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
