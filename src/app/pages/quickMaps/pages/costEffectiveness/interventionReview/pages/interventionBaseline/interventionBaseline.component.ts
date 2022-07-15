import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';

@Component({
  selector: 'app-intervention-baseline',
  templateUrl: './interventionBaseline.component.html',
  styleUrls: ['./interventionBaseline.component.scss'],
})
export class InterventionBaselineComponent implements AfterViewInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

  public baselineAssumptions: BaselineAssumptions;
  public selectedCompound: FoodVehicleCompound;
  public activeNutrientFVS: Array<FoodVehicleStandard>;

  public dataSource = new MatTableDataSource();
  public baselinedisplayedColumns = ['title', 'baseline_value'];

  public FVdataSource = new MatTableDataSource();
  public baselineFVdisplayedColumns = ['compound', 'targetVal', 'avgVal', 'optFort', 'calcFort'];

  public optionalUserEnteredAverageAtPointOfFortification = 0;

  private subscriptions = new Array<Subscription>();
  public activeInterventionId: string;

  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public ngAfterViewInit(): void {
    console.debug('id:', this.activeInterventionId);
    this.subscriptions.push(
      void this.quickMapsService.micronutrient.obs
        .subscribe((mn: MicronutrientDictionaryItem) => {
          if (null != mn) {
            this.interventionDataService
              .getInterventionFoodVehicleStandards(this.activeInterventionId)
              .then((data: InterventionFoodVehicleStandards) => {
                if (null != data) {
                  this.activeNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                    return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                  });
                  this.createFVTableObject(this.activeNutrientFVS);
                  void this.interventionDataService
                    .getInterventionBaselineAssumptions(this.activeInterventionId)
                    .then((data: InterventionBaselineAssumptions) => {
                      this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
                      this.createBaselineTableObject();
                      this.cdr.detectChanges();
                    });
                }
              });
          }
          this.cdr.detectChanges();
        })
    );
  }

  public createBaselineTableObject(): void {
    const dataArray = [];
    dataArray.push(this.baselineAssumptions.actuallyFortified, this.baselineAssumptions.potentiallyFortified);
    this.dataSource = new MatTableDataSource(dataArray);
  }

  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    this.selectedCompound = fvdata[0].compounds[0];
    this.FVdataSource = new MatTableDataSource(fvdata);
  }

  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }
}
