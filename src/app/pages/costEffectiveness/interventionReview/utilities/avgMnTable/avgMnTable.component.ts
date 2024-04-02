import { Component, OnInit } from '@angular/core';
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
  selector: 'app-avg-mn-table',
  templateUrl: './avgMnTable.component.html',
  styleUrls: ['./avgMnTable.component.scss'],
})
export class AvgMnTableComponent {
  public micronutrients: Array<FoodVehicleStandard> = [];
  public activeStandard: FoodVehicleStandard[];
  public baselineAssumptions: BaselineAssumptions;

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
  public newDataSource = new MatTableDataSource<AverageNutrientLevelTableObject>();

  public ROUTES = AppRoutes;
  public interventionName = 'IntName';
  private activeInterventionId: string;
  private subscriptions = new Array<Subscription>();

  constructor(
    public readonly interventionDataService: InterventionDataService,
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
  ) {
    this.micronutrients = this.interventionDataService.getCachedMnInPremix();
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      void this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        if (null != mn) {
          this.interventionDataService.getInterventionFoodVehicleStandards(this.activeInterventionId).then(() => {
            void this.interventionDataService
              .getInterventionBaselineAssumptions(this.activeInterventionId)
              .then((data: InterventionBaselineAssumptions) => {
                this.interventionDataService
                  .getInterventionBaselineAssumptions(this.interventionDataService.getActiveInterventionId())
                  .then((data: InterventionBaselineAssumptions) => {
                    if (null != data) {
                      this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
                    }
                    if (this.interventionDataService.getCachedMnInPremix()) {
                      this.micronutrients = this.interventionDataService.getCachedMnInPremix();
                    }
                  });

                if (null != data && null != this.micronutrients) {
                  const rawData = data.baselineAssumptions as BaselineAssumptions;
                  this.createAvNutrientLevelTable(rawData);
                }
              });
          });
        }
      }),
    );
  }

  public createAvNutrientLevelTable(baselineAssumptions: BaselineAssumptions): void {
    const arr = [];
    this.micronutrients.forEach((item: FoodVehicleStandard) => {
      // TODO: use user selected compound from step 1 below.
      const standardValue = item.compounds[1] ? item.compounds[1].targetVal : item.compounds[0].targetVal;

      const tableObject: AverageNutrientLevelTableObject = {
        micronutrient: item.micronutrient,
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
      arr.push(tableObject);
    });

    this.newDataSource = new MatTableDataSource(arr);
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
