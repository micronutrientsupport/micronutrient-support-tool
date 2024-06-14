import { InterventionLsffEffectivenessSummary } from 'src/app/apiAndObjects/objects/interventionLsffEffectivenessSummary';
import { CacheableEndpoint } from '../../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';
import { InterventionLsffEffectivenessSummaryAfe } from 'src/app/apiAndObjects/objects/interventionLsffEffectivenessSummaryAfe';
import { InterventionLsffEffectivenessSummaryCnd } from 'src/app/apiAndObjects/objects/interventionLsffEffectivenessSummaryCnd';

export class GetInterventionLsffEffectivenessSummary extends CacheableEndpoint<
  Array<InterventionLsffEffectivenessSummary>,
  GetInverventionsParams,
  InterventionLsffEffectivenessSummary
> {
  protected getCacheKey(params: GetInverventionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetInverventionsParams): Promise<InterventionLsffEffectivenessSummary[]> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.id, 'effectiveness-summary'],
      RequestMethod.GET,
      {
        aggregation: params.aggregation,
        metric: params.metric,
      },
    );

    if (params.metric && params.metric === 'cnd') {
      return this.buildObjectsFromResponse(InterventionLsffEffectivenessSummaryCnd, callResponsePromise);
    } else {
      return this.buildObjectsFromResponse(InterventionLsffEffectivenessSummaryAfe, callResponsePromise);
    }
  }

  protected callMock(): Promise<InterventionLsffEffectivenessSummary[]> {
    return null;
  }
}

export interface GetInverventionsParams {
  id: string;
  aggregation?: string;
  metric?: string;
}
