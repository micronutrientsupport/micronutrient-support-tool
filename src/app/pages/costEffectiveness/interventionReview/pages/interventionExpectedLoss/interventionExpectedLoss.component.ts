import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { InterventionProjectedHouseholds } from 'src/app/apiAndObjects/objects/interventionProjectedHouseholds';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionExpectedLosses } from 'src/app/apiAndObjects/objects/interventionExpectedLosses';
import { InterventionBaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';

@Component({
  selector: 'app-intervention-expected-losses',
  templateUrl: './interventionExpectedLoss.component.html',
  styleUrls: ['./interventionExpectedLoss.component.scss'],
})
export class InterventionExpectedLossComponent implements OnInit {
  public displayedColumns: string[] = [
    'micronutrient',
    'averageFortificationLevel',
    'expectedLosses',
    'averageFortificationLevelPoC',
    'source',
  ];

  public loading = false;
  public dataLoaded = false;
  public baseYear = 2021;
  public dataSource = new MatTableDataSource();

  public ROUTES = AppRoutes;
  public pageStepperPosition = 7;

  public prevRoute: AppRoute = AppRoutes.INTERVENTION_REVIEW_COMPLIANCE;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
  ) {}

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);

    const previousPage = this.intSideNavService.getPreviousStepperPosition();
    this.prevRoute =
      this.pageStepperPosition - previousPage === 1
        ? this.ROUTES.INTERVENTION_REVIEW_COST_SUMMARY
        : this.ROUTES.INTERVENTION_REVIEW_COMPLIANCE;

    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionExpectedLosses(activeInterventionId)
        .then((data: InterventionExpectedLosses) => {
          this.interventionDataService
            .getInterventionBaselineAssumptions(activeInterventionId)
            .then((baseline: InterventionBaselineAssumptions) => {
              console.log(data);
              console.log(baseline);

              for (const mn of data.expectedLosses) {
                mn['baseline'] = baseline.baselineAssumptions;
              }

              this.dataSource = new MatTableDataSource(data.expectedLosses);
              this.dataLoaded = true;
            });
        });
    }
  }

  public openExpectedLossesInfoDialog(): void {
    void this.dialogService.openExpectedLossesInfoDialog();
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }
}
