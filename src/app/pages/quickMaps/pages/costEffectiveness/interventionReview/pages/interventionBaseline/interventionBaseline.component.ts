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
  public selectedCompound: FoodVehicleCompound;

  public compounds: Array<FoodVehicleCompound>;
  // public selectedCompound: Compounds;
  public activeNutrientFVS: Array<FoodVehicleStandard>;
  public dataSource = new MatTableDataSource();
  public FVdataSource = new MatTableDataSource();
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public toggle: boolean = true;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public buttonValue: boolean = true;
  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

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
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);

    //get Baseline Assumptions
    void this.interventionDataService
      .getInterventionBaselineAssumptions('1')
      .then((data: InterventionBaselineAssumptions) => {
        this.createBaselineTableObject(data);
      });
    //get Food Vehicle Standards
    // void this.interventionDataService
    //   .getInterventionFoodVehicleStandards('1')
    //   .then((fvdata: InterventionFoodVehicleStandards) => {
    //     this.createFVTableObject(fvdata);
    //   });
  }

  public createBaselineTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];

    const rawData = data.baselineAssumptions as BaselineAssumptions;

    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    this.dataSource = new MatTableDataSource(dataArray);
  }
  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    this.selectedCompound = fvdata[0].compounds[0];
    // const FVdataArray = [];

    // const rawData = fvdata.foodVehicleStandard as FoodVehicleStandard[];

    // FVdataArray.push(rawData[0].compounds[0]);

    console.debug(fvdata);
    // console.debug(rawData[0].micronutrient);
    // console.debug('Compound 1: ', rawData[0].compounds[0].compound);

    this.FVdataSource = new MatTableDataSource(fvdata);

    console.log('fvdata[0]: ', fvdata[0]);

    console.log('fvdata[0].compounds[0]: ', fvdata[0].compounds[0]);

    console.log('fvdata[0].compounds[0].targetVal: ', fvdata[0].compounds[0].targetVal);
  }

  baselinedisplayedColumns = ['title', 'baseline_value'];
  baselineFVdisplayedColumns = ['compound', 'targetVal', 'avgVal', 'optFort', 'calcFort'];
  // baselineFVdisplayedColumns = ['compound'];
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
