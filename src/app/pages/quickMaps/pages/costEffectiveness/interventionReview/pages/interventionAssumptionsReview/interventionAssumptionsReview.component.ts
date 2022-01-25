import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-assumptions-review',
  templateUrl: './interventionAssumptionsReview.component.html',
  styleUrls: ['./interventionAssumptionsReview.component.scss'],
})
export class InterventionAssumptionsReviewComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 3;
  public ngAfterViewInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
