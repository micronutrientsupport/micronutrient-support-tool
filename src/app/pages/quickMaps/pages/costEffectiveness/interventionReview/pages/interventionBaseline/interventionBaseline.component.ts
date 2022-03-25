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
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
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

  public baselineAssumptions: BaselineAssumptions;
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
  public baselineComplianceDisplayedColumns = ['avgVal', 'optFort', 'calcFort'];
  public optionalUserEnteredAverageAtPointOfFortification = 0;

  public addedMnDatasource = new MatTableDataSource();
  public addedFVdisplayedColumns = ['micronutrient', 'compound', 'targetVal'];

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
                void this.interventionDataService
                  .getInterventionBaselineAssumptions('1')
                  .then((data: InterventionBaselineAssumptions) => {
                    this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
                    this.createBaselineTableObject();
                    this.createBaselineComplianceFortificationPractice();
                  });
              }
            });
        }
      }),
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createBaselineTableObject(): void {
    const dataArray = [];
    dataArray.push(this.baselineAssumptions.actuallyFortified, this.baselineAssumptions.potentiallyFortified);
    this.dataSource = new MatTableDataSource(dataArray);
  }

  public createFVTableObject(fvdata: Array<FoodVehicleStandard>): void {
    console.debug('upper', fvdata);
    this.selectedCompound = fvdata[0].compounds[0];
    this.FVdataSource = new MatTableDataSource(fvdata);
  }

  public createBaselineComplianceFortificationPractice(): void {
    const calcAverageAtPointOfFortification =
      this.selectedCompound.targetVal * this.baselineAssumptions.potentiallyFortified.year0;
    const optionalUserEnteredAverageAtPointOfFortification = this.optionalUserEnteredAverageAtPointOfFortification;
    const calcAverageFortificationLevelAmongAll =
      optionalUserEnteredAverageAtPointOfFortification * calcAverageAtPointOfFortification;

    const tableObject: ComplianceFortificationTableObject = {
      calcAverageAtPointOfFortification: calcAverageAtPointOfFortification,
      optionalUserEnteredAverageAtPointOfFortification: optionalUserEnteredAverageAtPointOfFortification,
      calcAverageFortificationLevelAmongAll: calcAverageFortificationLevelAmongAll,
    };
    this.complianceFortificationDatasource = new MatTableDataSource([tableObject]);
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

  public addMN(): void {
    void this.dialogService
      .openMnAdditionDialog()
      .then((dialogData: DialogData<Array<MicronutrientDictionaryItem>, Array<MicronutrientDictionaryItem>>) => {
        const mnArray = dialogData.dataOut;

        mnArray.forEach((mn: MicronutrientDictionaryItem) => {
          this.interventionDataService
            .getInterventionFoodVehicleStandards('1')
            .then((data: InterventionFoodVehicleStandards) => {
              if (null != data) {
                const addedNutrientFVS = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
                  return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
                });
                this.interventionDataService.addMnToCachedMnInPremix(addedNutrientFVS);
                this.createLowerTable();
              }
            });
        });
      });
  }

  public createLowerTable(): void {
    console.debug(this.interventionDataService.getCachedMnInPremix());
    this.addedMnDatasource = new MatTableDataSource(this.interventionDataService.getCachedMnInPremix());
  }
}

interface ComplianceFortificationTableObject {
  calcAverageAtPointOfFortification: number;
  optionalUserEnteredAverageAtPointOfFortification: number;
  calcAverageFortificationLevelAmongAll: number;
}
