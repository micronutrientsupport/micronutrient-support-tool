import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, pairwise, startWith, Subscription } from 'rxjs';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
  PotentiallyFortified,
  ActuallyFortified,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import { FoodVehicleStandard } from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
@Component({
  selector: 'app-intervention-compliance',
  templateUrl: './interventionCompliance.component.html',
  styleUrls: ['./interventionCompliance.component.scss'],
})
export class InterventionComplianceComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 1;
  public interventionName = 'IntName';
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public activeStandard: FoodVehicleStandard[];
  public rawDataArray: Array<PotentiallyFortified | ActuallyFortified> = [];

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
    private formBuilder: NonNullableFormBuilder,
  ) {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      void this.quickMapsService.micronutrient.obs.subscribe((mn: MicronutrientDictionaryItem) => {
        if (null != mn) {
          this.interventionDataService.getInterventionFoodVehicleStandards(activeInterventionId).then(() => {
            void this.interventionDataService
              .getInterventionBaselineAssumptions(activeInterventionId)
              .then((data: InterventionBaselineAssumptions) => {
                this.createTableObject(data);
                this.dataSource = new MatTableDataSource(this.rawDataArray);
                const assumptionsGroupArr = this.rawDataArray.map((item) => {
                  return this.createAssumptionGroup(item);
                });
                this.form = this.formBuilder.group({
                  items: this.formBuilder.array(assumptionsGroupArr),
                });
                const compareObjs = (a: Record<string, unknown>, b: Record<string, unknown>) => {
                  return Object.entries(b).filter(([key, value]) => value !== a[key]);
                };
                const changes = {};

                this.form.valueChanges
                  .pipe(
                    startWith(this.form.value),
                    pairwise(),
                    map(([oldState, newState]) => {
                      for (const key in newState.items) {
                        const rowIndex = this.form.get('items')['controls'][key]['controls'].rowIndex.value;

                        if (oldState.items[key] !== newState.items[key] && oldState.items[key] !== undefined) {
                          const diff = compareObjs(oldState.items[key], newState.items[key]);
                          if (Array.isArray(diff) && diff.length > 0) {
                            diff.forEach((item) => {
                              if (changes[rowIndex]) {
                                changes[rowIndex] = {
                                  ...changes[rowIndex],
                                  [item[0]]: Number(item[1]),
                                };
                                changes[rowIndex]['rowIndex'] = rowIndex;
                              } else {
                                changes[rowIndex] = {
                                  [item[0]]: Number(item[1]),
                                };
                                changes[rowIndex]['rowIndex'] = rowIndex;
                              }
                            });
                          }
                        }
                      }
                      return changes;
                    }),
                    filter((changes) => Object.keys(changes).length !== 0 && !this.form.invalid),
                  )
                  .subscribe((value) => {
                    this.formChanges = value;
                    const newInterventionChanges = {
                      ...this.interventionDataService.getInterventionDataChanges(),
                      ...this.formChanges,
                    };
                    this.interventionDataService.setInterventionDataChanges(newInterventionChanges);
                  });
              });
          });
        }
      }),
    );
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
  }

  public createTableObject(data: InterventionBaselineAssumptions): Array<PotentiallyFortified | ActuallyFortified> {
    // const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    this.rawDataArray.push(rawData.actuallyFortified, rawData.potentiallyFortified);
    // console.debug(dataArray);
    this.createAvNutrientLevelTable(rawData);
    return this.rawDataArray;
    // this.dataSource = new MatTableDataSource(this.rawDataArray);
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

  private createAssumptionGroup(item: PotentiallyFortified | ActuallyFortified): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [Number(item.year0), []],
      year1: [Number(item.year1), []],
      year2: [Number(item.year2), []],
      year3: [Number(item.year3), []],
      year4: [Number(item.year4), []],
      year5: [Number(item.year5), []],
      year6: [Number(item.year6), []],
      year7: [Number(item.year7), []],
      year8: [Number(item.year8), []],
      year9: [Number(item.year9), []],
    });
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
