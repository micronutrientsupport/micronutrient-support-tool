import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InterventionSideNavContentService {
  private readonly stepperPositionSrc = new BehaviorSubject<number>(null);
  public stepperPositionObs = this.stepperPositionSrc.asObservable();

  public setCurrentStepperPosition(position: number): void {
    this.stepperPositionSrc.next(position);
  }
}
