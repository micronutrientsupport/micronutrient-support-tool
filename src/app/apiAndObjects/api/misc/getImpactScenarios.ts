import { HttpClient } from '@angular/common/http';
import { ImpactScenario } from '../../objects/impactScenario';
import { PopulationGroup } from '../../objects/populationGroup';
import { RequestMethod } from '../../_lib_code/api/apiCaller';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetImpactScenarios extends CacheableEndpoint<
  Array<ImpactScenario>,
  GetImpactScenarioParams,
  ImpactScenario
> {
  protected getCacheKey(params: GetImpactScenarioParams): string {
    return JSON.stringify(params);
  }

  protected callLive(): Promise<Array<ImpactScenario>> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall('projection-scenario', RequestMethod.GET, {});

    return this.buildObjectsFromResponse(ImpactScenario, callResponsePromise);
  }

  protected callMock(): // params: TopFoodParams,
  Promise<Array<ImpactScenario>> {
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
