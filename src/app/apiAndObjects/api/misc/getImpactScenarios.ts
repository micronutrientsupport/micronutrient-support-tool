import { HttpClient } from '@angular/common/http';
import { ImpactScenario } from '../../objects/impactScenario';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
export class GetImpactScenarios extends CacheableEndpoint<
  Array<ImpactScenario>,
  GetImpactScenarioParams,
  ImpactScenario
 > {
  protected getCacheKey(params: GetImpactScenarioParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): Promise<Array<ImpactScenario>> {
    const callResponsePromise = this.apiCaller.doCall('projection-scenario', RequestMethod.GET, {});

    return this.buildObjectsFromResponse(ImpactScenario, callResponsePromise);
  }

  protected callMock(): Promise<Array<ImpactScenario>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      ImpactScenario,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/top-foods.json').toPromise());
        }, 1500);
      }),
    );
  }
}

export interface GetImpactScenarioParams {
  scenarioId: string;
}
