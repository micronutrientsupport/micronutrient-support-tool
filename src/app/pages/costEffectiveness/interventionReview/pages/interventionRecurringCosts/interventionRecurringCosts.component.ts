import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  InterventionRecurringCosts,
  RecurringCost,
  RecurringCosts,
} from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intervention-recurring-costs',
  templateUrl: './interventionRecurringCosts.component.html',
  styleUrls: ['./interventionRecurringCosts.component.scss'],
})
export class InterventionRecurringCostsComponent {
  public ROUTES = AppRoutes;
  public interventionName = 'IntName';
  public recurringCosts: Array<{ costs: RecurringCost; capitalCosts?: RecurringCost }>;

  public displayHeaders = [
    'section',
    'year0Total',
    'year1Total',
    'year2Total',
    'year3Total',
    'year4Total',
    'year5Total',
    'year6Total',
    'year7Total',
    'year8Total',
    'year9Total',
  ];

  private subscriptions = new Array<Subscription>();
  public dataLoaded = false;

  public loading = false;

  constructor(
    public intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private router: Router,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionRecurringCosts(activeInterventionId)
        .then((data: InterventionRecurringCosts) => {
          this.dataLoaded = true;
          this.recurringCosts = data.recurringCosts.map((cost) => {
            return {
              costs: cost,
            };
          });

          const industryCapitalIdx = data.recurringCosts.findIndex(
            (costs: RecurringCost) => (costs.category as string) === 'Industry-related capital costs',
          );
          const industryCapital = this.recurringCosts.splice(industryCapitalIdx, 1);
          // console.log({ industryCapital });

          const governmetnCapitalIdx = this.recurringCosts.findIndex(
            (costs: { costs: RecurringCost; capitalCosts: RecurringCost }) =>
              (costs.costs.category as string) === 'Government-related capital costs',
          );
          const governmetnCapital = this.recurringCosts.splice(governmetnCapitalIdx, 1);

          this.recurringCosts[1].capitalCosts = industryCapital[0].costs;
          this.recurringCosts[2].capitalCosts = governmetnCapital[0].costs;

          console.debug('initial: ', this.recurringCosts);
        });
    }

    this.subscriptions.push(
      this.interventionDataService.interventionRecurringCostChangedObs.subscribe((source: boolean) => {
        if (source === true) {
          if (null != activeInterventionId) {
            this.interventionDataService.interventionRecurringCostChanged(false);
            void this.interventionDataService
              .getInterventionRecurringCosts(activeInterventionId)
              .then((data: InterventionRecurringCosts) => {
                this.dataLoaded = true;
                setTimeout(() => {
                  this.recurringCosts = data.recurringCosts.map((cost) => {
                    return {
                      costs: cost,
                    };
                  });

                  const industryCapitalIdx = data.recurringCosts.findIndex(
                    (costs: RecurringCost) => (costs.category as string) === 'Industry-related capital costs',
                  );
                  const industryCapital = this.recurringCosts.splice(industryCapitalIdx, 1);
                  // console.log({ industryCapital });

                  const governmetnCapitalIdx = this.recurringCosts.findIndex(
                    (costs: { costs: RecurringCost; capitalCosts: RecurringCost }) =>
                      (costs.costs.category as string) === 'Government-related capital costs',
                  );
                  const governmetnCapital = this.recurringCosts.splice(governmetnCapitalIdx, 1);

                  this.recurringCosts[1].capitalCosts = industryCapital[0].costs;
                  this.recurringCosts[2].capitalCosts = governmetnCapital[0].costs;
                }, 0);
                // this.recurringCosts = data.recurringCosts;
              });
          }
        }
      }),
    );
  }

  public trackRoute(index: number) {
    console.log('TrackRoute');
    return 1;
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
