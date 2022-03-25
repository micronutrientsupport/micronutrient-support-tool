import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import {
  CostSummary,
  InterventionCostSummary,
  SummaryCostBreakdown,
} from 'src/app/apiAndObjects/objects/InterventionCostSummary';
import { RecurringCost, InterventionRecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
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
  public summaryCosts: InterventionCostSummary;
  public startupCosts: Array<StartUpScaleUpCost>;

  private subscriptions = new Array<Subscription>();

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    this.subscriptions.push(
      void this.interventionDataService.getInterventionCostSummary('1').then((data: InterventionCostSummary) => {
        this.summaryCosts = data;
        console.debug('summaryCosts ', data);
      }),
      // void this.interventionDataService.getInterventionStartupCosts('1').then((data: InterventionStartupCosts) => {
      //   this.startupCosts = data.startupScaleupCosts;
      //   console.debug('data', data);
      // }),
    );
  }
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
