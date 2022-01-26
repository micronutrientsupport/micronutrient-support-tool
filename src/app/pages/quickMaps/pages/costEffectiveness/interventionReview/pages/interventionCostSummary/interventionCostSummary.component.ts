import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-cost-summary',
  templateUrl: './interventionCostSummary.component.html',
  styleUrls: ['./interventionCostSummary.component.scss'],
})
export class InterventionCostSummaryComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 8;
  public interventionName = 'IntName';
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
