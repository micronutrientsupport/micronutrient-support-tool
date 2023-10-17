import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
@Component({
  selector: 'app-intervention-assumptions-review',
  templateUrl: './interventionAssumptionsReview.component.html',
  styleUrls: ['./interventionAssumptionsReview.component.scss'],
})
export class InterventionAssumptionsReviewComponent implements OnInit {
  @Input() public editable = false;
  public activeStandard: FoodVehicleStandard[];

  public assumptionsDisplayedColumns = [
    'title',
    'year0',
    'year1',
    'year2',
    'year3',
    'year4',
    'year5',
    'year6',
    'year7',
    'year8',
    'year9',
  ];
  public averageNutrientDisplayedColumns = [
    'micronutrient',
    'standard',
    'year0',
    'year1',
    'year2',
    'year3',
    'year4',
    'year5',
    'year6',
    'year7',
    'year8',
    'year9',
  ];
  public dataSource = new MatTableDataSource();
  public newDataSource = new MatTableDataSource<AverageNutrientLevelTableObject>();

  public ROUTES = AppRoutes;
  public pageStepperPosition = 2;
  public interventionName = 'IntName';
  private subscriptions = new Array<Subscription>();

  public dataLoaded = false;

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      void this.interventionDataService.getIntervention(activeInterventionId).then((intervention: Intervention) => {
        if (null != intervention.focusMicronutrient) {
          this.interventionDataService.getInterventionFoodVehicleStandards(activeInterventionId).then(
            () =>
              void this.interventionDataService
                .getInterventionBaselineAssumptions(activeInterventionId)
                .then((data: InterventionBaselineAssumptions) => {
                  this.createTableObject(data);
                }),
          );
          // .then((data: InterventionFoodVehicleStandards) => {
          // this.activeStandard = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
          //   return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
          // });
          // });
        }
      }),
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    this.dataLoaded = true;
    this.dataSource = new MatTableDataSource(dataArray);
    this.createAvNutrientLevelTable(rawData);
  }

  public createAvNutrientLevelTable(baselineAssumptions: BaselineAssumptions): void {
    const fvArray = [];

    this.interventionDataService
      .getInterventionFoodVehicleStandards(this.interventionDataService.getActiveInterventionId())
      .then((standards: InterventionFoodVehicleStandards) => {
        console.log(standards);

        standards.foodVehicleStandard.forEach((standard) => {
          const nonZeroCompound = standard.compounds.find((compound) => compound?.targetVal > 0);
          if (nonZeroCompound) {
            console.log(standard.micronutrient, nonZeroCompound);
            const cache = this.interventionDataService.getCachedMnInPremix();
            console.log('The Cache', cache);

            if (!cache || !cache.find((element) => element.micronutrient === standard.micronutrient)) {
              console.log('Not found');
            }

            if (!cache || !cache.find((element) => element.micronutrient === standard.micronutrient)) {
              // Prepopulate table with food vehicle standards where target value not 0
            }

            const standardValue = nonZeroCompound.targetVal;
            const tableObject: AverageNutrientLevelTableObject = {
              micronutrient: standard.micronutrient,
              standard: standardValue,
              year0:
                baselineAssumptions.actuallyFortified.year0 *
                baselineAssumptions.potentiallyFortified.year0 *
                standardValue,
              year1:
                baselineAssumptions.actuallyFortified.year1 *
                baselineAssumptions.potentiallyFortified.year1 *
                standardValue,
              year2:
                baselineAssumptions.actuallyFortified.year2 *
                baselineAssumptions.potentiallyFortified.year2 *
                standardValue,
              year3:
                baselineAssumptions.actuallyFortified.year3 *
                baselineAssumptions.potentiallyFortified.year3 *
                standardValue,
              year4:
                baselineAssumptions.actuallyFortified.year4 *
                baselineAssumptions.potentiallyFortified.year4 *
                standardValue,
              year5:
                baselineAssumptions.actuallyFortified.year5 *
                baselineAssumptions.potentiallyFortified.year5 *
                standardValue,
              year6:
                baselineAssumptions.actuallyFortified.year6 *
                baselineAssumptions.potentiallyFortified.year6 *
                standardValue,
              year7:
                baselineAssumptions.actuallyFortified.year7 *
                baselineAssumptions.potentiallyFortified.year7 *
                standardValue,
              year8:
                baselineAssumptions.actuallyFortified.year8 *
                baselineAssumptions.potentiallyFortified.year8 *
                standardValue,
              year9:
                baselineAssumptions.actuallyFortified.year9 *
                baselineAssumptions.potentiallyFortified.year9 *
                standardValue,
            };
            fvArray.push(tableObject);
          }
        });
        console.log('FV', fvArray);
        this.newDataSource = new MatTableDataSource(fvArray);
      });
  }

  public formatNumberForDisplay(value: number): number {
    return Math.round(value * 100) / 1; // rounds the number to two decimal places and creates a percentage
  }
}
interface AverageNutrientLevelTableObject {
  micronutrient: string;
  standard: number;
  year0: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  year6: number;
  year7: number;
  year8: number;
  year9: number;
}
