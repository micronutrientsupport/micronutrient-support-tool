import { Intervention } from '../../../objects/intervention';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { HttpHeaders } from '@angular/common/http';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { Endpoint } from 'src/app/apiAndObjects/_lib_code/api/endpoint.abstract';

export class PatchIntervention extends Endpoint<Intervention, GetInverventionsParams, Intervention> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<Intervention> {
    const activeUser = localStorage.getItem('activeUser')
      ? (JSON.parse(localStorage.getItem('activeUser')) as LoginRegisterResponseDataSource)
      : null;
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
