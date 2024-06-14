import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { InterventionProjectedHouseholds } from 'src/app/apiAndObjects/objects/interventionProjectedHouseholds';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-expected-losses',
  templateUrl: './interventionExpectedLoss.component.html',
  styleUrls: ['./interventionExpectedLoss.component.scss'],
})
export class InterventionExpectedLossComponent implements OnInit {
  public displayedColumns: string[] = [
    'areaName',
    'population2021',
    'population2022',
    'population2023',
    'population2024',
    'population2025',
    'population2026',
    'population2027',
    'population2028',
    'population2029',
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
        .getInterventionProjectedHouseholds(activeInterventionId)
        .then((data: InterventionProjectedHouseholds[]) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataLoaded = true;
        });
    }
  }

  public openProjectedHouseholdsInfoDialog(): void {
    void this.dialogService.openProjectedHouseholdsInfoDialog();
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }
}
