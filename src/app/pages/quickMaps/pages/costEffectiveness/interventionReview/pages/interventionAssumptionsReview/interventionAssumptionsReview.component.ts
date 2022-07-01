import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { FoodVehicleStandard } from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-assumptions-review',
  templateUrl: './interventionAssumptionsReview.component.html',
  styleUrls: ['./interventionAssumptionsReview.component.scss'],
})
export class InterventionAssumptionsReviewComponent {
  public activeStandard: FoodVehicleStandard[];

  public assumptionsDisplayedColumns = [
    'title',
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
  public averageNutrientDisplayedColumns = [
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
  private subscriptions = new Array<Subscription>();

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        if (null != mn) {
          this.interventionDataService.getInterventionFoodVehicleStandards(activeInterventionId);
          // .then((data: InterventionFoodVehicleStandards) => {
          // this.activeStandard = data.foodVehicleStandard.filter((standard: FoodVehicleStandard) => {
          //   return standard.micronutrient.includes(mn.name.toLocaleLowerCase());
          // });
          // });
        }
      }),
      void this.interventionDataService
        .getInterventionBaselineAssumptions(activeInterventionId)
        .then((data: InterventionBaselineAssumptions) => {
          this.createTableObject(data);
        }),
    );
  }
  public ROUTES = AppRoutes;
  public pageStepperPosition = 3;
  public interventionName = 'IntName';
  public ngAfterViewInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createTableObject(data: InterventionBaselineAssumptions): void {
    const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    dataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    console.debug(rawData);
    this.dataSource = new MatTableDataSource(dataArray);
    this.createAvNutrientLevelTable(rawData);
  }

  public createAvNutrientLevelTable(baselineAssumptions: BaselineAssumptions): void {
    const standardValue = 5.63;
    const tableObject: AverageNutrientLevelTableObject = {
      standard: standardValue,
      year0:
        baselineAssumptions.actuallyFortified.year0 * baselineAssumptions.potentiallyFortified.year0 * standardValue,
      year1:
        baselineAssumptions.actuallyFortified.year1 * baselineAssumptions.potentiallyFortified.year1 * standardValue,
      year2:
        baselineAssumptions.actuallyFortified.year2 * baselineAssumptions.potentiallyFortified.year2 * standardValue,
      year3:
        baselineAssumptions.actuallyFortified.year3 * baselineAssumptions.potentiallyFortified.year3 * standardValue,
      year4:
        baselineAssumptions.actuallyFortified.year4 * baselineAssumptions.potentiallyFortified.year4 * standardValue,
      year5:
        baselineAssumptions.actuallyFortified.year5 * baselineAssumptions.potentiallyFortified.year5 * standardValue,
      year6:
        baselineAssumptions.actuallyFortified.year6 * baselineAssumptions.potentiallyFortified.year6 * standardValue,
      year7:
        baselineAssumptions.actuallyFortified.year7 * baselineAssumptions.potentiallyFortified.year7 * standardValue,
      year8:
        baselineAssumptions.actuallyFortified.year8 * baselineAssumptions.potentiallyFortified.year8 * standardValue,
      year9:
        baselineAssumptions.actuallyFortified.year9 * baselineAssumptions.potentiallyFortified.year9 * standardValue,
    };
    this.newDataSource = new MatTableDataSource([tableObject]);
  }

  public formatNumberForDisplay(value: number): number {
    return Math.round(value * 100) / 1; // rounds the number to two decimal places and creates a percentage
  }
}
interface AverageNutrientLevelTableObject {
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
