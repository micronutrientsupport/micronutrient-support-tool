import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterventionCreationService {
  private readonly interventionLoadeSrc = new BehaviorSubject<void>(null);
  public readonly interventionLoadObs = this.interventionLoadeSrc.asObservable();

  private readonly interventionRemovalSrc = new BehaviorSubject<string>(null);
  public readonly interventionRemovalObs = this.interventionRemovalSrc.asObservable();

  private readonly interventionsSelectedCountSrc = new BehaviorSubject<number>(null);
  public readonly interventionsSelectedCountObs = this.interventionsSelectedCountSrc.asObservable();

  constructor() {
    // add content
  }

  public watchInterventionLoad(): void {
    this.interventionLoadeSrc.next();
  }

  public interventionRemove(interventionIdToRemove: string): void {
    this.interventionRemovalSrc.next(interventionIdToRemove);
  }

  public updateCurrentInterventionsCount(count: number): void {
    this.interventionsSelectedCountSrc.next(count);
  }
}
