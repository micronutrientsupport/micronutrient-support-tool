import { InterventionData } from 'src/app/apiAndObjects/objects/interventionData';
import { CacheableEndpoint } from 'src/app/apiAndObjects/_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from 'src/app/apiAndObjects/_lib_code/api/requestMethod.enum';

export class UpdateInterventionData extends CacheableEndpoint<
  InterventionData,
  UpdateInterventionDataParams,
  InterventionData
> {
  protected getCacheKey(params: UpdateInterventionDataParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: UpdateInterventionDataParams): Promise<InterventionData> {
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

export interface UpdateInterventionDataParams {
  interventionId: string;
  data: Record<string, unknown>;
}
