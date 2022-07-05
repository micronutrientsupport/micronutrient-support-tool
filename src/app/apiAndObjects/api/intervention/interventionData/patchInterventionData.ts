import { InterventionData } from 'src/app/apiAndObjects/objects/interventionData';
import { CacheableEndpoint } from 'src/app/apiAndObjects/_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from 'src/app/apiAndObjects/_lib_code/api/requestMethod.enum';

export class PatchInterventionData extends CacheableEndpoint<
  InterventionData,
  PatchInterventionDataParams,
  InterventionData
> {
  protected getCacheKey(params: PatchInterventionDataParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: PatchInterventionDataParams): Promise<InterventionData> {
    const callResponsePromise = this.apiCaller.doCall(
      ['interventions', params.interventionId, 'data'],
      RequestMethod.PATCH,
      null,
      params.data,
    );

    return this.buildObjectsFromResponse(InterventionData, callResponsePromise).then(
      (interventionData: Array<InterventionData>) => interventionData[0],
    );
  }

  protected callMock(): Promise<InterventionData> {
    throw new Error('Method not implemented.');
  }
}

export interface PatchInterventionDataParams {
  interventionId: string;
  data: Record<string, unknown>;
}
