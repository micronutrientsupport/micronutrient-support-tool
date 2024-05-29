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

@Component({
  selector: 'app-intervention-effectiveness-households',
  templateUrl: './interventionEffectivenessHouseholds.component.html',
  styleUrls: ['./interventionEffectivenessHouseholds.component.scss'],
})
export class InterventionEffectivenessHouseholdsComponent implements OnInit {
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
  public pageStepperPosition = 6;

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private dialogService: DialogService,
    private interventionDataService: InterventionDataService,
  ) {}

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
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
