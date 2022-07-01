import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostEffectivenessService {
  private readonly interventionComparisonActiveSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly interventionComparisonActiveObs = this.interventionComparisonActiveSrc.asObservable();

  constructor() {
    // add content
  }

  public setInterventionComparisonStatus(cardVisible: boolean): void {
    this.interventionComparisonActiveSrc.next(cardVisible);
  }
}
