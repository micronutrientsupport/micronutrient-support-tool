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
import { InterventionCostEffectivenessSummary } from 'src/app/apiAndObjects/objects/interventionCostEffectivenessSummary';

@Component({
  selector: 'app-intervention-cost-effectiveness-summary',
  templateUrl: './interventionCostEffectivenessSummary.component.html',
  styleUrls: ['./interventionCostEffectivenessSummary.component.scss'],
})
export class InterventionCostEffectivenessSummaryComponent implements OnInit {
  public displayedColumns: string[] = [
    'intervention',
    'annualAverageCost',
    'averageHouseholdsCovered',
    'costPerHouseholdCovered',
  ];

  public loading = false;
  public dataLoaded = false;
  public baseYear = 2021;
  public dataSource = new MatTableDataSource();

  public ROUTES = AppRoutes;

  private subscriptions = new Array<Subscription>();

  public selectedIntervention: Intervention;

  constructor(
    public quickMapsService: QuickMapsService,
    public intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.interventionDataService
      .getIntervention(this.interventionDataService.getActiveInterventionId())
      .then((selectedIntervention: Intervention) => {
        this.selectedIntervention = selectedIntervention;
      });
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionCostEffectivenessSummary(activeInterventionId)
        .then((data: InterventionCostEffectivenessSummary) => {
          console.log(data);
          this.dataSource = new MatTableDataSource([data]);
          this.dataLoaded = true;
        });
    }
  }

  public openCostEffectivenessInfoDialog(): void {
    void this.dialogService.openCostEffectivenessInfoDialog();
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
