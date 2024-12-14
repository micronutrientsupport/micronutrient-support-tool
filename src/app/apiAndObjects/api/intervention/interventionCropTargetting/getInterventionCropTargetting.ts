import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionCropTargetting } from 'src/app/apiAndObjects/objects/interventionCropTargetting';

export class GetInterventionCropTargetting extends CacheableEndpoint<
  InterventionCropTargetting,
  GetInverventionsParams,
  InterventionCropTargetting
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionCropTargetting> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'crop-targetting'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionCropTargetting, callResponsePromise);
  }

  protected callMock(): Promise<InterventionCropTargetting> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
