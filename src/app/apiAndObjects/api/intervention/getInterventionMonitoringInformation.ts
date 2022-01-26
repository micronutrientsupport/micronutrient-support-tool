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
      {
        id: params.id,
      },
    );

    return this.buildObjectFromResponse(InterventionMonitoringInformation, callResponsePromise);
  }

  protected callMock(): Promise<InterventionMonitoringInformation> {
    // const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return this.buildObjectsFromResponse(
    //   MonthlyFoodGroup,
    //   // response after delay
    //   new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve(httpClient.get('/assets/exampleData/monthly-food-groups.json').toPromise());
    //     }, 1500);
    //   }).then((data: Record<string, unknown>) => {
    //     if (null != data) {
    //       // change something so that the display changes a little
    //       // eslint-disable-next-line @typescript-eslint/dot-notation
    //       data[0][MonthlyFoodGroup.KEYS.PERCENTAGE_MN_CONSUMED] = Math.floor(Math.random() * 40);
    //     }
    return null;
    //   }),
    // );
  }
}

export interface GetInverventionsParams {
  id: string;
}
