import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/InterventionCostSummary';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-cost-summary',
  templateUrl: './interventionCostSummary.component.html',
  styleUrls: ['./interventionCostSummary.component.scss'],
})
export class InterventionCostSummaryComponent {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public ROUTES = AppRoutes;
  public pageStepperPosition = 8;
  public interventionName = 'IntName';
  public selectedTab: number;
  public summaryCosts: InterventionCostSummary;
  public chartSummaryPNG = '';
  public chartSummaryPDF = '';
  private subscriptions = new Array<Subscription>();

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private cdRef: ChangeDetectorRef,
  ) {}
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);

    this.subscriptions.push(
      void this.interventionDataService.getInterventionCostSummary('1').then((data: InterventionCostSummary) => {
        this.summaryCosts = data;
      }),
      void this.interventionDataService.interventionSummaryChartPNGObs.subscribe((chart: string) => {
        this.chartSummaryPNG = chart;
        this.cdRef.detectChanges();
      }),
      void this.interventionDataService.interventionSummaryChartPDFObs.subscribe((chart: string) => {
        this.chartSummaryPDF = chart;
        this.cdRef.detectChanges();
      }),
    );
  }
}
