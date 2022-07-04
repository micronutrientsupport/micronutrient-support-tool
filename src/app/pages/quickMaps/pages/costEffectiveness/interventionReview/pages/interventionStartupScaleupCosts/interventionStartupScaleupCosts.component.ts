import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InterventionStartupCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-startup-scaleup-costs',
  templateUrl: './interventionStartupScaleupCosts.component.html',
  styleUrls: ['./interventionStartupScaleupCosts.component.scss'],
})
export class InterventionStartupScaleupCostsComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 6;
  public interventionName = 'IntName';

  public startupCosts: Array<StartUpScaleUpCost>;
  public displayHeaders = ['section', 'year0Total', 'year1Total'];

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionStartupCosts(activeInterventionId)
        .then((data: InterventionStartupCosts) => {
          this.startupCosts = data.startupScaleupCosts;
        });
    }
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
