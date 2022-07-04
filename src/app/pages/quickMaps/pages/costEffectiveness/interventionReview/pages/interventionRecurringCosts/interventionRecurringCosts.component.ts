import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InterventionRecurringCosts, RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-recurring-costs',
  templateUrl: './interventionRecurringCosts.component.html',
  styleUrls: ['./interventionRecurringCosts.component.scss'],
})
export class InterventionRecurringCostsComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 7;
  public interventionName = 'IntName';
  public recurringCosts: Array<RecurringCost>;
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

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionRecurringCosts(activeInterventionId)
        .then((data: InterventionRecurringCosts) => {
          this.recurringCosts = data.recurringCosts;
        });
    }
  }
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
