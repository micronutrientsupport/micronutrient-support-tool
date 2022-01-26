import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;
  public interventionName = 'IntName';
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
