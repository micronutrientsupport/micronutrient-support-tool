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
  @ViewChild('interventionStepper', { static: false }) stepper: MatStepper;
  public currentStepPosition = 0;

  // Note: as the stepper is set to linear, if you try and set the
  // stepper position other than 0 it will appear not to be working
  public setStepperPosition(position: number): void {
    setTimeout(() => {
      this.stepper.selectedIndex = position;
    });
  }
}
