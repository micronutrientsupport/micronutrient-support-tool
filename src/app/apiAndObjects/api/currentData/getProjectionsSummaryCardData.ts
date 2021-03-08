import { ProjectionsSummaryCard as ProjectionsSummaryCard } from '../../objects/projectionsSummaryCard';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetProjectionsSummaryCardData extends CacheableEndpoint<
  Array<ProjectionsSummaryCard>, ProjectionsSummaryCardParams, ProjectionsSummaryCard> {
  protected getCacheKey(params: ProjectionsSummaryCardParams): string {
    return JSON.stringify(params);
  }

  protected callLive(
    params: ProjectionsSummaryCardParams,
  ): Promise<Array<ProjectionsSummaryCard>> {
    // throw new Error('Method not implemented.');
    const callResponsePromise = this.apiCaller.doCall(
      ['projections', 'summary', params.countryOrGroupId, params.micronutrientId, params.scenarioId],
      RequestMethod.GET,
    );

    return this.buildObjectsFromResponse(ProjectionsSummaryCard, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: ProjectionsSummaryCardParams): Promise<ProjectionsSummaryCard[]> {
    throw new Error('Method not implemented.');
  }

}

export interface ProjectionsSummaryCardParams {
  countryOrGroupId: string;
  micronutrientId: string;
  scenarioId: string;
}
