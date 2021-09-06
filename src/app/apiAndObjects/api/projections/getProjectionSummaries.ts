import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { ProjectionsSummary } from '../../objects/projectionSummary';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectionSummaries extends CacheableEndpoint<ProjectionsSummary, ProjectionSummaryParams> {
  protected getCacheKey(params: ProjectionSummaryParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: ProjectionSummaryParams): Promise<ProjectionsSummary> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(['diet', 'projections', 'summaries'], RequestMethod.GET, {
      countryId: params.country.id,
      micronutrientId: params.micronutrient.id,
      scenarioId: params.scenarioId,
    });

    return this.buildObjectFromResponse(ProjectionsSummary, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: ProjectionSummaryParams): Promise<ProjectionsSummary> {
    throw new Error('Method not implemented.');
  }
}

export interface ProjectionSummaryParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  scenarioId: string;
}
