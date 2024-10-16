import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { ImpactScenarioDictionaryItem } from '../../objects/dictionaries/impactScenarioDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { ProjectionsSummary } from '../../objects/projectionSummary';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectionSummaries extends CacheableEndpoint<ProjectionsSummary, GetProjectionSummaryParams> {
  protected getCacheKey(params: GetProjectionSummaryParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetProjectionSummaryParams): Promise<ProjectionsSummary> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(['diet', 'projections', 'summaries'], RequestMethod.GET, {
      countryId: params.country.id,
      micronutrientId: params.micronutrient.id,
      scenarioId: params.scenario.id,
    });

    return this.buildObjectFromResponse(ProjectionsSummary, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetProjectionSummaryParams): Promise<ProjectionsSummary> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      ProjectionsSummary,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lastValueFrom(httpClient.get('/assets/exampleData/projection-summary.json')) as Promise<ProjectionsSummary>,
          );
        }, 1500);
      }),
    );
  }
}

export interface GetProjectionSummaryParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  scenario: ImpactScenarioDictionaryItem;
}
