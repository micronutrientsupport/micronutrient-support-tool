import { Component } from '@angular/core';
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
export class InterventionRecurringCostsComponent {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 7;
  public interventionName = 'IntName';
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
