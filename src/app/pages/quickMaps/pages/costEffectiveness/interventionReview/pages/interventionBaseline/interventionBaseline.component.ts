import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  Compounds,
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
export class InterventionBaselineComponent {
  public compounds: Array<Compounds>;
  public selectedCompound: Compounds;
  public activeNutrientFVS: Array<FoodVehicleStandard>;

  private subscriptions = new Array<Subscription>();
  constructor(
    public quickMapsService: QuickMapsService,
    private interventionDataService: InterventionDataService,
    private dialogService: DialogService,
    private intSideNavService: InterventionSideNavContentService,
  ) {
    this.subscriptions.push(
      this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        console.debug('mn', mn);
        if (null != mn) {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              console.debug('data', data);
              if (null != data) {
                this.activeNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  console.debug(standard.micronutrient.includes(mn.name.toLocaleLowerCase()));
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                console.debug(this.activeNutrientFVS);
                this.createFVTableObject(this.activeNutrientFVS);
              }
            });
        }
      }),
    );
  }
  public dataSource = new MatTableDataSource();
  public FVdataSource = new MatTableDataSource();

  public ROUTES = AppRoutes;
  public pageStepperPosition = 0;

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

    // console.debug(rawData);
    // console.debug(rawData.actuallyFortified.title);

    this.dataSource = new MatTableDataSource(dataArray);
  }
  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    // const FVdataArray = [];

    // const rawData = fvdata.foodVehicleStandard as FoodVehicleStandard[];

    // FVdataArray.push(rawData[0].compounds[0]);

    // console.debug(rawData);
    // console.debug(rawData[0].micronutrient);
    // console.debug('Compound 1: ', rawData[0].compounds[0].compound);

    this.FVdataSource = new MatTableDataSource(fvdata);
  }

  baselinedisplayedColumns = ['title', 'baseline_value', 'gfdx'];
  baselineFVdisplayedColumns = ['compound', 'targetVal'];

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
}
