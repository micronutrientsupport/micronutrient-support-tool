import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InterventionStartupCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intervention-startup-scaleup-costs',
  templateUrl: './interventionStartupScaleupCosts.component.html',
  styleUrls: ['./interventionStartupScaleupCosts.component.scss'],
})
export class InterventionStartupScaleupCostsComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 4;
  public interventionName = 'IntName';

  public startupCosts: Array<StartUpScaleUpCost>;
  public displayHeaders = ['section', 'year0Total', 'year1Total'];

  private subscriptions = new Array<Subscription>();

  public loading = false;

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private router: Router,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionStartupCosts(activeInterventionId)
        .then((data: InterventionStartupCosts) => {
          this.startupCosts = data.startupScaleupCosts;
        });
    }

    this.subscriptions.push(
      this.interventionDataService.interventionStartupCostChangedObs.subscribe((source: boolean) => {
        if (source === true) {
          if (null != activeInterventionId) {
            this.interventionDataService.interventionStartupCostChanged(false);
            void this.interventionDataService
              .getInterventionStartupCosts(activeInterventionId)
              .then((data: InterventionStartupCosts) => {
                // setting null then timeout prevents the chart from flickering and allows animation to work
                console.log('Reset the scaleup costs');
                this.startupCosts = null;
                setTimeout(() => {
                  this.startupCosts = data.startupScaleupCosts;
                }, 0);
              });
          }
        }
      }),
    );
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
