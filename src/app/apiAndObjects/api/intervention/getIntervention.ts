/* tslint:disable: no-string-literal */
import { Intervention } from '../../objects/intervention';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetIntervention extends CacheableEndpoint<Intervention, GetInverventionsParams, Intervention> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<Intervention> {
    const callResponsePromise = this.apiCaller.doCall(['interventions', params.id], RequestMethod.GET, {
      id: params.id,
    });

    return this.buildObjectFromResponse(Intervention, callResponsePromise);
  }

  protected callMock(): Promise<Intervention> {
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
