import { Component, OnInit } from '@angular/core';
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
} from 'src/app/apiAndObjects/objects/InterventionFoodVehicleStandards';
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
export class InterventionBaselineComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;
  public selectedCompound: FoodVehicleCompound;
  public activeNutrientFVS: Array<FoodVehicleStandard>;

  // TODO: Assign these to correct variables
  public toggle = true;
  public buttonValue = true;

  public dataSource = new MatTableDataSource();
  baselinedisplayedColumns = ['title', 'baseline_value'];

  public FVdataSource = new MatTableDataSource();
  public baselineFVdisplayedColumns = ['compound', 'targetVal'];

  public complianceFortificationDatasource = new MatTableDataSource();
  public baselineFVpracticedisplayedColumns = ['avgVal', 'optFort', 'calcFort'];

  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
  ) {
    this.subscriptions.push(
      this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        if (null != mn) {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              if (null != data) {
                this.activeNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                this.createFVTableObject(this.activeNutrientFVS);
              }
            });
        }
      }),
      void this.interventionDataService
        .getInterventionBaselineAssumptions('1')
        .then((data: InterventionBaselineAssumptions) => {
          this.createBaselineTableObject(data);
          this.createBaselineComplianceFortificationPractice(data);
        }),
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createBaselineTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    this.dataSource = new MatTableDataSource(dataArray);
  }

  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    this.selectedCompound = fvdata[0].compounds[0];
    this.FVdataSource = new MatTableDataSource(fvdata);
  }

  public createBaselineComplianceFortificationPractice(data: InterventionBaselineAssumptions): void {
    const baselineInterventionAssumptionData = data.baselineAssumptions as BaselineAssumptions;
    const calcAverageAtPointOfFortification =
      baselineInterventionAssumptionData.actuallyFortified.year0 *
      baselineInterventionAssumptionData.potentiallyFortified.year0;
    const tableObject: ComplianceFortificationTableObject = {
      calcAverageAtPointOfFortification: calcAverageAtPointOfFortification,
      optionalUserEnteredAverageAtPointOfFortification:
        calcAverageAtPointOfFortification * calcAverageAtPointOfFortification,
      calcAverageFortificationLevelAmongAll: 0.8,
    };
    this.complianceFortificationDatasource = new MatTableDataSource([tableObject]);
  }

  public resetValues(): void {
    void this.dialogService.openCEResetDialog();
    // .then((data: DialogData) => {
    // this.selectedInterventions.push(data.dataOut);
    // });
  }
  public addMN(): void {
    void this.dialogService.openMnAdditionDialog();
    // .then((data: DialogData) => {
    // this.selectedInterventions.push(data.dataOut);
    // });
  }
  public openFortificationInfoDialog(): void {
    void this.dialogService.openFortificationInfoDialog();
  }
  public openCalculatedFortificationInfoDialog(): void {
    void this.dialogService.openCalculatedFortificationInfoDialog();
  }
  public inputType(): void {
    this.buttonValue = !this.buttonValue;
  }
}

interface ComplianceFortificationTableObject {
  calcAverageAtPointOfFortification: number;
  optionalUserEnteredAverageAtPointOfFortification: number;
  calcAverageFortificationLevelAmongAll: number;
}
