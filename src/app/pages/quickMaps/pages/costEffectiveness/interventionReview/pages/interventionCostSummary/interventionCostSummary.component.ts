import { Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { RecurringCost, InterventionRecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-cost-summary',
  templateUrl: './interventionCostSummary.component.html',
  styleUrls: ['./interventionCostSummary.component.scss'],
})
export class InterventionCostSummaryComponent {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public ROUTES = AppRoutes;
  public pageStepperPosition = 8;
  public interventionName = 'IntName';
  public selectedTab: number;
  private subscriptions = new Array<Subscription>();
  public recurringCosts: Array<RecurringCost>;

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    this.subscriptions.push(
      void this.interventionDataService.getInterventionRecurringCosts('1').then((data: InterventionRecurringCosts) => {
        this.recurringCosts = data.recurringCosts;
        console.debug('data', data);
      }),
    );
  }
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
