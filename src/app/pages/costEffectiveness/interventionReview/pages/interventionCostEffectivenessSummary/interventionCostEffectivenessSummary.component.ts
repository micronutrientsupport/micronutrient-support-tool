import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { InterventionProjectedHouseholds } from 'src/app/apiAndObjects/objects/interventionProjectedHouseholds';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionLsffEffectivenessSummary } from 'src/app/apiAndObjects/objects/interventionLsffEffectivenessSummary';

@Component({
  selector: 'app-intervention-cost-effectiveness-summary',
  templateUrl: './interventionCostEffectivenessSummary.component.html',
  styleUrls: ['./interventionCostEffectivenessSummary.component.scss'],
})
export class InterventionCostEffectivenessSummaryComponent implements OnInit {
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
  public pageStepperPosition = 11;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionLsffEffectivenessSummary(activeInterventionId)
        .then((data: InterventionLsffEffectivenessSummary[]) => {
          console.log(data);
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

  public onSubmit(): void {
    // navigate back to list of selected interventions
    this.router.navigate(this.ROUTES.COST_EFFECTIVENESS.getRoute(), {
      queryParams: this.route.snapshot.queryParams,
    });
  }
}
