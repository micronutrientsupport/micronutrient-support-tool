/* eslint-disable @typescript-eslint/member-ordering */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostEffectivenessService {
  private readonly interventionComparisonActiveSrc = new BehaviorSubject<boolean>(false);
  public readonly interventionComparisonActiveObs = this.interventionComparisonActiveSrc.asObservable();

  private readonly addMicronutrient = new BehaviorSubject<boolean>(false);
  public readonly addMicronutrientObs = this.addMicronutrient.asObservable();

  public setInterventionComparisonStatus(cardVisible: boolean): void {
    this.interventionComparisonActiveSrc.next(cardVisible);
  }

  public setAddMicronutrient(trigger: boolean): void {
    this.addMicronutrient.next(trigger);
  }
}
