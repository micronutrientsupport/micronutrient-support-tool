import { Intervention } from '../../../objects/intervention';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { HttpHeaders } from '@angular/common/http';
import { LoginRegisterResponseDataSource } from 'src/app/apiAndObjects/objects/loginRegisterResponseDataSource';
import { InterventionTemplates } from 'src/app/apiAndObjects/objects/interventionTemplates';
import { Endpoint } from 'src/app/apiAndObjects/_lib_code/api/endpoint.abstract';

export class GetInterventionTemplates extends Endpoint<InterventionTemplates, null, InterventionTemplates> {
  protected callLive(): Promise<InterventionTemplates> {
    const callResponsePromise = this.apiCaller.doCall(['intervention-templates'], RequestMethod.GET);

    return this.buildObjectFromResponse(InterventionTemplates, callResponsePromise);
  }

  protected callMock(): Promise<InterventionTemplates> {
    return null;
  }
}
