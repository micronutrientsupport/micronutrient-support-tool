import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/interventionCostSummary';
import { InterventionRecurringCosts, RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intervention-cost-summary',
  templateUrl: './interventionCostSummary.component.html',
  styleUrls: ['./interventionCostSummary.component.scss'],
})
export class InterventionCostSummaryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public ROUTES = AppRoutes;
  public pageStepperPosition = 8;
  public interventionName = 'IntName';
  public selectedTab: number;
  public selectedTabSummary: number;
  //TODO: Leaving variable as any but should change.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public summaryCosts: { costBreakdown: any[] };
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
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      this.subscriptions.push(
        // Summary tab subscriptions
        void this.interventionDataService
          .getInterventionCostSummary(activeInterventionId)
          .then((data: InterventionCostSummary) => {
            console.log('summary');
            const sums = data.summaryCosts[0]['costs'].filter((section) => section['section'] === 'Summaries');
            console.log(sums);
            this.summaryCosts = sums[0];
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

  public ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  public onSubmit(): void {
    // navigate back to list of selected interventions
    this.router.navigate(this.ROUTES.COST_EFFECTIVENESS.getRoute(), {
      queryParams: this.route.snapshot.queryParams,
    });
  }
}
