import { InterventionResponse } from '../../../objects/interventionResponse';
import { Endpoint } from '../../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class PostIntervention extends Endpoint<InterventionResponse, PostInterventionParams, InterventionResponse> {
  protected callLive(params: PostInterventionParams): Promise<InterventionResponse> {
    const callResponsePromise = this.apiCaller.doCall(['feedback'], RequestMethod.POST, null, {
      id: params.id,
      name: params.name,
      description: params.description,
      countryId: params.countryId,
      fortificationTypeId: params.fortificationTypeId,
      fortificationTypeName: params.fortificationTypeName,
      programStatus: params.programStatus,
      foodVehicleId: params.foodVehicleId,
      foodVehicleName: params.foodVehicleName,
      baseYear: params.baseYear,
      tenYearTotalCost: params.tenYearTotalCost,
    });
    return this.buildObjectFromResponse(InterventionResponse, callResponsePromise);
  }
  protected callMock(): Promise<InterventionResponse> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(InterventionResponse, promise);
  }
}

export interface PostInterventionParams {
  id?: number;
  name?: string;
  description?: string;
  countryId?: string;
  fortificationTypeId?: string;
  fortificationTypeName?: string;
  programStatus?: string;
  foodVehicleId?: number;
  foodVehicleName?: string;
  baseYear?: number;
  tenYearTotalCost?: number;
}
