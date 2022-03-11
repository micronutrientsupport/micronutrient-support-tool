import { Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-cost-summary',
  templateUrl: './interventionCostSummary.component.html',
  styleUrls: ['./interventionCostSummary.component.scss'],
})
export class InterventionCostSummaryComponent {
  constructor(private intSideNavService: InterventionSideNavContentService) {}
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public ROUTES = AppRoutes;
  public pageStepperPosition = 8;
  public interventionName = 'IntName';
  public selectedTab: number;

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }
}
