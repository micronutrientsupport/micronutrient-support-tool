import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { InterventionProjectedHouseholds } from 'src/app/apiAndObjects/objects/interventionProjectedHouseholds';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionExpectedLosses } from 'src/app/apiAndObjects/objects/interventionExpectedLosses';
import { InterventionBaselineAssumptions } from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { Router } from '@angular/router';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';

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

  public prevRoute: AppRoute = AppRoutes.INTERVENTION_REVIEW_COMPLIANCE;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    public intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private router: Router,
    private interventionDataService: InterventionDataService,
  ) {}

  public ngOnInit(): void {
    const previousPage = this.intSideNavService.getPreviousStepperPosition();
    this.prevRoute =
      //   this.pageStepperPosition - previousPage === 1
      //?
      this.ROUTES.INTERVENTION_REVIEW_COST_SUMMARY;
    //    : this.ROUTES.INTERVENTION_REVIEW_COMPLIANCE;

    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionExpectedLosses(activeInterventionId)
        .then((data: InterventionExpectedLosses) => {
          this.interventionDataService
            .getInterventionBaselineAssumptions(activeInterventionId)
            .then((baseline: InterventionBaselineAssumptions) => {
              this.interventionDataService.getIntervention(activeInterventionId).then((intervention: Intervention) => {
                console.log(data);
                console.log(baseline);

                const eLFocusMN = data.expectedLosses.filter((val) => {
                  return val.micronutrient === intervention.focusMicronutrient;
                });

                for (const mn of eLFocusMN) {
                  mn['baseline'] = baseline.baselineAssumptions;
                }

                this.dataSource = new MatTableDataSource(eLFocusMN);
                this.dataLoaded = true;
              });
            });
        });
    }
  }

  public openExpectedLossesInfoDialog(): void {
    void this.dialogService.openExpectedLossesInfoDialog();
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }
}
