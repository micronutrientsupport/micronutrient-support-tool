import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { Intervention } from '../apiAndObjects/objects/intervention';

@Injectable({
  providedIn: 'root',
})
export class InterventionDataService {
  constructor(private apiService: ApiService) {}

  public getIntervention(id: string): Promise<Intervention> {
    return this.apiService.endpoints.intervention.getIntervention.call({
      id,
    });
  }
  public getInterventionData(id: string): Promise<Intervention> {
    return this.apiService.endpoints.intervention.getInterventionData.call({
      id,
    });
  }
}
