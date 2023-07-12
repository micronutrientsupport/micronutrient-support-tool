import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InterventionSideNavContentService {
  private readonly stepperPositionSrc = new BehaviorSubject<number>(null);
  public stepperPositionObs = this.stepperPositionSrc.asObservable();
  private readonly stepperPreviousnSrc = new BehaviorSubject<void>(null);
  public stepperPreviousObs = this.stepperPreviousnSrc.asObservable();
  private readonly stepperNextnSrc = new BehaviorSubject<void>(null);
  public stepperNextObs = this.stepperNextnSrc.asObservable();

  public setCurrentStepperPosition(position: number): void {
    this.stepperPositionSrc.next(position);
  }
  public setStepperPrevious(): void {
    this.stepperPreviousnSrc.next();
  }
  public setStepperNext(): void {
    this.stepperNextnSrc.next();
  }
}
