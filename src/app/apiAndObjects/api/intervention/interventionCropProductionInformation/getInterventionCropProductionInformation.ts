import { InterventionCropProductionInformation } from '../../../objects/interventionCropProductionInformation';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class GetInterventionCropProductionInformation extends CacheableEndpoint<
  InterventionCropProductionInformation,
  GetInverventionsParams,
  InterventionCropProductionInformation
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionCropProductionInformation> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'crop-production-information'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionCropProductionInformation, callResponsePromise);
  }

  protected callMock(): Promise<InterventionCropProductionInformation> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
