import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-compliance',
  templateUrl: './interventionCompliance.component.html',
  styleUrls: ['./interventionCompliance.component.scss'],
})
export class InterventionComplianceComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 1;
  public interventionName = 'IntName';
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
