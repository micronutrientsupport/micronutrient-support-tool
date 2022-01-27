/* tslint:disable: no-string-literal */

import { InterventionMonitoringInformation } from '../../objects/interventionMonitoringInformation';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetInterventionMonitoringInformation extends CacheableEndpoint<
  InterventionMonitoringInformation,
  GetInverventionsParams,
  InterventionMonitoringInformation
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionMonitoringInformation> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'monitoring-information'],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(InterventionMonitoringInformation, callResponsePromise);
  }

  protected callMock(): Promise<InterventionMonitoringInformation> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
}
