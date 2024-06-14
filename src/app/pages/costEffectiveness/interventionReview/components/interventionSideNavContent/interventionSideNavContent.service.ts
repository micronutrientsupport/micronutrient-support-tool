import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InterventionSideNavContentService {
  private readonly stepperPositionSrc = new BehaviorSubject<number>(null);
  public stepperPositionObs = this.stepperPositionSrc.asObservable();

  private previousStepPosition = 0;
  private currentStepPosition = 0;

  public setCurrentStepperPosition(position: number): void {
    this.previousStepPosition = this.currentStepPosition;
    this.currentStepPosition = position;
    this.stepperPositionSrc.next(position);
  }

  public getPreviousStepperPosition(): number {
    return this.previousStepPosition;
  }
}
