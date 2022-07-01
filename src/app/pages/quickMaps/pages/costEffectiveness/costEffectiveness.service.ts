import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostEffectivenessService {
  private readonly interventionComparisonActiveSrc = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly interventionComparisonActiveObs = this.interventionComparisonActiveSrc.asObservable();

  private readonly interventionIdSrc = new BehaviorSubject<string>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly interventionIdObs = this.interventionIdSrc.asObservable();

  constructor() {
    // add content
  }

  public setInterventionComparisonStatus(cardVisible: boolean): void {
    this.interventionComparisonActiveSrc.next(cardVisible);
  }

  public setId(id: string): void {
    this.interventionIdSrc.next(id);
  }

  public getId(): string {
    return this.interventionIdSrc.getValue();
  }
}
