import { InterventionStatus } from 'src/app/apiAndObjects/objects/interventionStatus';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from 'src/app/apiAndObjects/_lib_code/api/requestMethod.enum';

export class GetInterventionStatus extends CacheableEndpoint<Array<InterventionStatus>, null, InterventionStatus> {
  protected getCacheKey(): string {
    return 'intervention-status';
  }
  protected callLive(): Promise<InterventionStatus[]> {
    const callResponsePromise = this.apiCaller.doCall([`intervention-status`], RequestMethod.GET);
    return this.buildObjectsFromResponse(InterventionStatus, callResponsePromise);
  }

  protected callMock(): Promise<InterventionStatus[]> {
    return null;
  }
}
