import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from './interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-sidenav-content',
  templateUrl: './interventionSideNavContent.component.html',
  styleUrls: ['./interventionSideNavContent.component.scss'],
})
export class InterventionSideNavContentComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {
    this.subscriptions.push(
      this.intSideNavService.stepperPositionObs.subscribe((position: number) => {
        this.setStepperPosition(position);
      }),
    );
  }
  private subscriptions = new Array<Subscription>();
  public ROUTES = AppRoutes;
  @ViewChild('interventionStepperAssumptions', { static: false }) stepperAssumptions: MatStepper;
  @ViewChild('interventionStepperCosts', { static: false }) stepperCosts;
  @ViewChild('interventionStepperEffectiveness', { static: false }) stepperEffectiveness: MatStepper;
  @ViewChild('interventionStepperSummary', { static: false }) stepperSummary: MatStepper;

  public assumptionSteps = 3;
  public costsSteps = 4;
  public effectivenessSteps = 2;
  public summarySteps = 1;

  public currentStepPosition = 0;

  public setStepperPosition(position: number): void {
    setTimeout(() => {
      if (position < this.assumptionSteps) {
        console.log(`${position} => assumptions ${position}`);
        this.stepperAssumptions.selectedIndex = position;
      } else if (position < this.assumptionSteps + this.costsSteps) {
        console.log(`${position} => costs ${position - this.assumptionSteps}`);
        this.stepperCosts.selectedIndex = position - this.assumptionSteps;
      } else if (position < this.assumptionSteps + this.costsSteps + this.effectivenessSteps) {
        console.log(`${position} => effectiveness ${position - (this.assumptionSteps + this.costsSteps)}`);
        this.stepperEffectiveness.selectedIndex = position - (this.assumptionSteps + this.costsSteps);
      } else {
        console.log(
          `${position} => summary ${position - (this.assumptionSteps + this.costsSteps + this.effectivenessSteps)}`,
        );
        this.stepperSummary.selectedIndex =
          position - (this.assumptionSteps + this.costsSteps + this.effectivenessSteps);
      }
      this.currentStepPosition = position;
    });
  }
}
