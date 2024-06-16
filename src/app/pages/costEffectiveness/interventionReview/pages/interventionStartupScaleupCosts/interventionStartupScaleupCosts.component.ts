import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  InterventionStartupCosts,
  StartUpScaleUpCost,
  StartUpScaleUpCostCategoryType,
} from 'src/app/apiAndObjects/objects/interventionStartupCosts';
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

  public userCosts: Array<StartUpScaleUpCost> = [
    // {
    //   category: StartUpScaleUpCostCategoryType.USER,
    //   costs: [
    //     {
    //       section: 'Extra snacks',
    //       costBreakdown: [
    //         {
    //           labelText: 'Extra chocolate',
    //           rowIndex: 'E1',
    //           year0: 10,
    //           year0Default: 10,
    //           year0Edited: 0,
    //           year0Overriden: false,
    //           year1: 15,
    //           year1Default: 15,
    //           year1Edited: 0,
    //           year1Overriden: false,
    //           rowUnits: 'US dollars',
    //           isEditable: true,
    //           isCalculated: false,
    //           dataSource: 'User defined',
    //           dataSourceDefault: 'User defined',
    //           dataCitation: 'User defined',
    //         },
    //       ],
    //       year0Total: 100,
    //       year0TotalFormula: null,
    //       year1Total: 500,
    //       year1TotalFormula: null,
    //     },
    //     {
    //       section: 'Parking costs',
    //       costBreakdown: [
    //         {
    //           labelText: 'Parking tickets',
    //           rowIndex: 'E2',
    //           year0: 100,
    //           year0Default: 10,
    //           year0Edited: 0,
    //           year0Overriden: false,
    //           year1: 150,
    //           year1Default: 15,
    //           year1Edited: 0,
    //           year1Overriden: false,
    //           rowUnits: 'US dollars',
    //           isEditable: true,
    //           isCalculated: false,
    //           dataSource: 'User defined',
    //           dataSourceDefault: 'User defined',
    //           dataCitation: 'User defined',
    //         },
    //       ],
    //       year0Total: 100,
    //       year0TotalFormula: null,
    //       year1Total: 500,
    //       year1TotalFormula: null,
    //     },
    //   ],
    // },
  ];

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
