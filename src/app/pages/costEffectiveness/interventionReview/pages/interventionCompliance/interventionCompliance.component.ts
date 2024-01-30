import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, pairwise, startWith, Subscription } from 'rxjs';
import {
  BaselineAssumptions,
  InterventionBaselineAssumptions,
  PotentiallyFortified,
  ActuallyFortified,
  AverageFortificationLevel,
} from 'src/app/apiAndObjects/objects/interventionBaselineAssumptions';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from 'src/app/apiAndObjects/objects/interventionFoodVehicleStandards';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { AppRoute, AppRoutes, getRoute } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intervention-compliance',
  templateUrl: './interventionCompliance.component.html',
  styleUrls: ['./interventionCompliance.component.scss'],
})
export class InterventionComplianceComponent implements OnInit {
  public ROUTES = AppRoutes;
  public pageStepperPosition = 1;
  public interventionName = 'IntName';
  public activeStandard: FoodVehicleStandard[];
  public rawDataArray: Array<PotentiallyFortified | ActuallyFortified | AverageFortificationLevel> = [];
  public dirtyIndexes = [];
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
  public baseYear = 2021;
  public baselineAssumptions: BaselineAssumptions;
  public dataSource = new MatTableDataSource();
  public newDataSource = new MatTableDataSource<AverageNutrientLevelTableObject>();
  private subscriptions = new Array<Subscription>();
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  public dataLoaded = false;
  public loading = false;

  constructor(
    public quickMapsService: QuickMapsService,
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
  ) {}

  private initFormWatcher(): void {
    /*
        if (null != intervention.focusMicronutrient) {
          this.interventionDataService.getInterventionFoodVehicleStandards(activeInterventionId)
          */

    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionBaselineAssumptions(activeInterventionId)
        .then((data: InterventionBaselineAssumptions) => {
          this.createTableObject(data);
          console.log('init', this.rawDataArray);
          this.dataSource = new MatTableDataSource(this.rawDataArray);
          const assumptionsGroupArr = this.rawDataArray.map((item) => {
            return this.createAssumptionGroup(item);
          });
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(assumptionsGroupArr),
          });

          this.dataLoaded = true;

          // Mark fields as touched/dirty if they have been previously edited and stored via the API
          this.interventionDataService.setFormFieldState(this.form, this.dirtyIndexes);

          // Setup watched to track changes made to form fields and store them to the intervention
          // data service to be synced to the API when needed
          this.interventionDataService.initFormChangeWatcher(this.form, this.formChanges);
        });
    }
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    this.initFormWatcher();
  }

  public createTableObject(
    data: InterventionBaselineAssumptions,
  ): Array<PotentiallyFortified | ActuallyFortified | AverageFortificationLevel> {
    // const dataArray = [];
    const rawData = data.baselineAssumptions as BaselineAssumptions;
    this.rawDataArray.push(rawData.potentiallyFortified, rawData.actuallyFortified, rawData.averageFortificationLevel);
    // console.debug(dataArray);
    this.baselineAssumptions = rawData;
    this.createAvNutrientLevelTable(rawData);
    return this.rawDataArray;
    // this.dataSource = new MatTableDataSource(this.rawDataArray);
  }

  public createAvNutrientLevelTable(baselineAssumptions: BaselineAssumptions): void {
    const standardValue = 5.63;

    // this.interventionDataService
    // .getInterventionBaselineAssumptions(this.interventionDataService.getActiveInterventionId())
    // .then((data: InterventionBaselineAssumptions) => {
    //   this.baselineAssumptions = data.baselineAssumptions as BaselineAssumptions;
    //   if (this.interventionDataService.getCachedMnInPremix()) {
    //     this.micronutrients = this.interventionDataService.getCachedMnInPremix();
    //   }
    // });

    const fvArray = [];

    this.interventionDataService
      .getInterventionFoodVehicleStandards(this.interventionDataService.getActiveInterventionId())
      .then((standards: InterventionFoodVehicleStandards) => {
        console.log(standards);

        standards.foodVehicleStandard.sort((a, b) => {
          // Standard alphabetic sort
          const sortVal = a.micronutrient > b.micronutrient ? 1 : -1;

          // If nutrient is focus MN then override and push to top
          console.log({ a: a.micronutrient, b: b.micronutrient, sortVal: sortVal });
          if (a.micronutrient === 'Zn') {
            return -1;
          } else {
            return sortVal;
          }
        });
        console.log(standards);

        standards.foodVehicleStandard.forEach((standard) => {
          const nonZeroCompound = standard.compounds.find((compound) => compound?.targetVal > 0);
          if (nonZeroCompound) {
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

  private createAssumptionGroup(
    item: PotentiallyFortified | ActuallyFortified | AverageFortificationLevel,
  ): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      rowUnits: [item.rowUnits, []],
      isEditable: [item.isEditable, []],
      isCalculated: [item.isCalculated, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
      year0Overriden: item.year0Overriden,
      year0Formula: item.year0Formula,
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year1Default: [Number(item.year1Default), []],
      year1Overriden: item.year1Overriden,
      year1Formula: item.year1Formula,
      year2: [Number(item.year2), []],
      year2Edited: [Boolean(item.year2Edited), []],
      year2Default: [Number(item.year2Default), []],
      year2Overriden: item.year2Overriden,
      year2Formula: item.year2Formula,
      year3: [Number(item.year3), []],
      year3Edited: [Boolean(item.year3Edited), []],
      year3Default: [Number(item.year3Default), []],
      year3Overriden: item.year3Overriden,
      year3Formula: item.year3Formula,
      year4: [Number(item.year4), []],
      year4Edited: [Boolean(item.year4Edited), []],
      year4Default: [Number(item.year4Default), []],
      year4Overriden: item.year4Overriden,
      year4Formula: item.year4Formula,
      year5: [Number(item.year5), []],
      year5Edited: [Boolean(item.year5Edited), []],
      year5Default: [Number(item.year5Default), []],
      year5Overriden: item.year5Overriden,
      year5Formula: item.year5Formula,
      year6: [Number(item.year6), []],
      year6Edited: [Boolean(item.year6Edited), []],
      year6Default: [Number(item.year6Default), []],
      year6Overriden: item.year6Overriden,
      year6Formula: item.year6Formula,
      year7: [Number(item.year7), []],
      year7Edited: [Boolean(item.year7Edited), []],
      year7Default: [Number(item.year7Default), []],
      year7Overriden: item.year7Overriden,
      year7Formula: item.year7Formula,
      year8: [Number(item.year8), []],
      year8Edited: [Boolean(item.year8Edited), []],
      year8Default: [Number(item.year8Default), []],
      year8Overriden: item.year8Overriden,
      year8Formula: item.year8Formula,
      year9: [Number(item.year9), []],
      year9Edited: [Boolean(item.year9Edited), []],
      year9Default: [Number(item.year9Default), []],
      year9Overriden: item.year9Overriden,
      year9Formula: item.year9Formula,
    });
  }

  public updateBaselineAssumptions = () => {
    console.log('Updateyfy');

    for (const year of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const potentiallyFortified = this.form.controls.items['controls'][0]['controls']['year' + year].value / 100;
      const actuallyFortified = this.form.controls.items['controls'][1]['controls']['year' + year].value / 100;
      const averageFortificationLevel = this.form.controls.items['controls'][2]['controls']['year' + year].value / 100;
      // console.log(row);

      console.log(this.baselineAssumptions);

      this.baselineAssumptions.potentiallyFortified['year' + year] = potentiallyFortified;
      this.baselineAssumptions.actuallyFortified['year' + year] = actuallyFortified;
      this.baselineAssumptions.averageFortificationLevel['year' + year] = averageFortificationLevel;
    }
  };

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
