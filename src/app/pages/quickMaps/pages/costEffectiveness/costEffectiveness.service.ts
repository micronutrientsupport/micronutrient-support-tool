import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostEffectivenessService {
  private readonly interventionComparisonActiveSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly interventionComparisonActiveObs = this.interventionComparisonActiveSrc.asObservable();

  private readonly resetIndustryInfoForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly resetIndustryInfoFormObs = this.resetIndustryInfoForm.asObservable();

  public setInterventionComparisonStatus(cardVisible: boolean): void {
    this.interventionComparisonActiveSrc.next(cardVisible);
  }

  public setResetIndustryInfoForm(): void {
    this.resetIndustryInfoForm.next(true);
  }
}
