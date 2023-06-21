import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { Endpoint } from '../../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../../_lib_code/api/requestMethod.enum';

export class PostIntervention extends Endpoint<Intervention, PostInterventionParams> {
  protected getCacheKey(params: PostInterventionParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params?: PostInterventionParams): Promise<Intervention> {
    const callResponsePromise = this.apiCaller.doCall(['interventions'], RequestMethod.POST, null, {
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
      parentInterventionId: params.parentInterventionId,
      newInterventionName: params.newInterventionName,
      newInterventionDescription: params.newInterventionDescription,
      newInterventionNation: params.newInterventionNation,
      newInterventionFocusGeography: params.newInterventionFocusGeography,
      newInterventionFocusMicronutrient: params.newInterventionFocusMicronutrient,
    });
    return this.buildObjectFromResponse(Intervention, callResponsePromise);
  }

  protected callMock(): Promise<Intervention> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(Intervention, promise);
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
  parentInterventionId: number;
  newInterventionName?: string;
  newInterventionDescription?: string;
  newInterventionNation?: string;
  newInterventionFocusGeography?: string;
  newInterventionFocusMicronutrient?: string;
}
