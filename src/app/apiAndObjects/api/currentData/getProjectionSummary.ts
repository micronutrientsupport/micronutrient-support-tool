import { ProjectionsSummary } from '../../objects/projectionSummary';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectionSummary extends CacheableEndpoint<ProjectionsSummary, ProjectionSummaryParams> {
  protected getCacheKey(params: ProjectionSummaryParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: ProjectionSummaryParams): Promise<ProjectionsSummary> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(
      ['projections', 'summary', params.countryOrGroupId, params.micronutrientId, params.scenarioId],
      RequestMethod.GET,
    );

    return this.buildObjectFromResponse(ProjectionsSummary, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: ProjectionSummaryParams): Promise<ProjectionsSummary> {
    throw new Error('Method not implemented.');
  }
}

export interface ProjectionSummaryParams {
  countryOrGroupId: string;
  micronutrientId: string;
  scenarioId: string;
}
