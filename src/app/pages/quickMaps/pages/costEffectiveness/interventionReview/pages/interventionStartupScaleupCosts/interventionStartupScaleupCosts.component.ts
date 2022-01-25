import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-startup-scaleup-costs',
  templateUrl: './interventionStartupScaleupCosts.component.html',
  styleUrls: ['./interventionStartupScaleupCosts.component.scss'],
})
export class InterventionStartupScaleupCostsComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 6;
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
