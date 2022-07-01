import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/interventionCostSummary';
import { InterventionRecurringCosts, RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
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
  public startupCosts: Array<StartUpScaleUpCost>;
  public recurringCosts: Array<RecurringCost>;
  public chartSummaryPNG = '';
  public chartSummaryPDF = '';
  public chartDetailedPNG = '';
  public chartDetailedPDF = '';
  private subscriptions = new Array<Subscription>();

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private cdRef: ChangeDetectorRef,
  ) {}
  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      // Summary tab subscriptions
      void this.interventionDataService
        .getInterventionCostSummary(activeInterventionId)
        .then((data: InterventionCostSummary) => {
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

      // Detailed tab subscripttions
      void this.interventionDataService
        .getInterventionStartupCosts(activeInterventionId)
        .then((data: InterventionStartupCosts) => {
          this.startupCosts = data.startupScaleupCosts;
        }),
      void this.interventionDataService
        .getInterventionRecurringCosts(activeInterventionId)
        .then((data: InterventionRecurringCosts) => {
          this.recurringCosts = data.recurringCosts;
        }),
      void this.interventionDataService.interventionDetailedChartPNGObs.subscribe((chart: string) => {
        this.chartDetailedPNG = chart;
        this.cdRef.detectChanges();
      }),
      void this.interventionDataService.interventionDetailedChartPDFObs.subscribe((chart: string) => {
        this.chartDetailedPDF = chart;
        this.cdRef.detectChanges();
      }),
    );
  }
}
