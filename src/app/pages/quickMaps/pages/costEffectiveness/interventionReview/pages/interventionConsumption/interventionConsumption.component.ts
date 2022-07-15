import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-consumption',
  templateUrl: './interventionConsumption.component.html',
  styleUrls: ['./interventionConsumption.component.scss'],
})
export class InterventionConsumptionComponent implements OnInit {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  public ROUTES = AppRoutes;
  public pageStepperPosition = 2;
  public interventionName = 'IntName';

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
