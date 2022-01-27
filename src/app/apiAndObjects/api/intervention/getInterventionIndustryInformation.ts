import { InterventionIndustryInformation } from '../../objects/interventionIndustryInformation';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetInterventionIndustryInformation extends CacheableEndpoint<
  InterventionIndustryInformation,
  GetInverventionsParams,
  InterventionIndustryInformation
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionIndustryInformation> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'industry-information'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionIndustryInformation, callResponsePromise);
  }

  protected callMock(): Promise<InterventionIndustryInformation> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
