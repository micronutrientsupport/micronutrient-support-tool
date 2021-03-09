import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { ImpactScenario } from '../apiAndObjects/objects/impactScenario';

@Injectable()
export class MiscApiService {
  constructor(private apiService: ApiService) { }

  public getImpactScenarios(): Promise<Array<ImpactScenario>> {
    return this.apiService.endpoints.misc.getImpactScenarios.call();
  }
}
