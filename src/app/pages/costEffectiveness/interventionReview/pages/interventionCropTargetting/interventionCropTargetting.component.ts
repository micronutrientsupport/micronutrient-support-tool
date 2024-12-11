import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CropProductionInformation,
  InterventionCropProductionInformation,
} from 'src/app/apiAndObjects/objects/interventionCropProductionInformation';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { UntypedFormArray, UntypedFormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { InterventionCropTargetting } from 'src/app/apiAndObjects/objects/interventionCropTargetting';
@Component({
  selector: 'app-intervention-crop-targetting',
  templateUrl: './interventionCropTargetting.component.html',
  styleUrls: ['./interventionCropTargetting.component.scss'],
})
export class InterventionCropTargettingComponent implements OnInit {
  public dirtyIndexes = [];
  public displayedColumns: string[] = [
    'region',
    'is_region_targeted',
    'zones_targeted',
    'cultivation_area_ha',
    'targeted_area_ha',
    'regional_share_pc',
  ];

  public loading = false;

  public baseYear = 2021;
  public dataSource = new MatTableDataSource();
  public ROUTES = AppRoutes;
  public interventionName = 'IntName';
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public dataLoaded = false;

  public nextRoutes = [];
  public previousRoute;

  public cropTargetting: InterventionCropTargetting;

  constructor(
    public intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    public notificationsService: NotificationsService,
  ) {}

  private initFormWatcher(): void {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionCropTargetting(activeInterventionId)
        .then((data: InterventionCropTargetting) => {
          this.cropTargetting = data;
          this.dataSource = new MatTableDataSource(data.cropTargetting);

          this.dataLoaded = true;
        });
    }
  }

  get totalTargetedArea(): number {
    return this.cropTargetting.cropTargetting.reduce((acc, curr) => acc + curr.targeted_area_ha, 0);
  }

  get totalZonesTargeted(): number {
    return this.cropTargetting.cropTargetting.reduce((acc, curr) => acc + curr.zones_targeted, 0);
  }

  get totalAddShare(): number {
    return this.cropTargetting.cropTargetting.reduce((acc, curr) => acc + curr.regional_share_pc, 0);
  }

  public ngOnInit(): void {
    this.initFormWatcher();
    this.intSideNavService.readyObs.subscribe(() => {
      this.nextRoutes = this.intSideNavService.getNextRoutes();
      this.previousRoute = this.intSideNavService.getPreviousRoute();
    });
  }

  public async confirmAndContinue(route: AppRoute): Promise<boolean> {
    this.loading = true;
    await this.interventionDataService.interventionPageConfirmContinue();
    this.loading = false;
    this.router.navigate(getRoute(route));
    return true;
  }

  public resetForm() {
    this.interventionDataService.resetForm(this.form, this.dirtyIndexes);
  }
}
