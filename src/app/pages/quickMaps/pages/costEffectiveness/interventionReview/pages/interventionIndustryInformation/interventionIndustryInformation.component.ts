import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  IndustryInformation,
  InterventionIndustryInformation,
} from 'src/app/apiAndObjects/objects/interventionIndustryInformation';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { InterventionSideNavContentService } from '../../components/interventionSideNavContent/interventionSideNavContent.service';
import { UntypedFormArray, UntypedFormGroup, NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { JSONLogicService } from 'src/app/services/jsonlogic.service';

@Component({
  selector: 'app-intervention-industry-information',
  templateUrl: './interventionIndustryInformation.component.html',
  styleUrls: ['./interventionIndustryInformation.component.scss'],
})
export class InterventionIndustryInformationComponent implements OnInit {
  public dirtyIndexes = [];
  public displayedColumns: string[] = [
    'labelText',
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
    'source',
  ];

  public dataSource = new MatTableDataSource();
  public ROUTES = AppRoutes;
  public pageStepperPosition = 3;
  public interventionName = 'IntName';
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public dataLoaded = false;

  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private formBuilder: NonNullableFormBuilder,
    private jsonLogicService: JSONLogicService,
  ) {}

  /**
   * Create a table data source from API response, then construct into a FormArray.
   *
   * The .valueChanges() method then tracks any updates to the form and retrieves
   * only the values that have changed.
   *
   * Finally, the data is returned in the subscription
   * at the end of the chain for processing.
   *
   */
  private initFormWatcher(): void {
    const activeInterventionId = this.interventionDataService.getActiveInterventionId();
    if (null != activeInterventionId) {
      void this.interventionDataService
        .getInterventionIndustryInformation(activeInterventionId)
        .then((data: InterventionIndustryInformation) => {
          this.dataSource = new MatTableDataSource(data.industryInformation);
          const industryGroupArr = data.industryInformation.map((item) => {
            // for each item in the API result, create a row of results to populate the table
            return this.createIndustryGroup(item);
          });
          this.form = this.formBuilder.group({
            items: this.formBuilder.array(industryGroupArr),
          });

          this.dataLoaded = true;

          // Mark fields as touched/dirty if they have been previously edited and stored via the API
          this.form.controls.items['controls'].forEach((formRow: FormGroup, rowIndex: number) => {
            let yearIndex = 0;
            Object.keys(formRow.controls).forEach((key: string) => {
              if (key === 'year' + yearIndex) {
                if (formRow.controls['isEditable'].value === false) {
                  formRow.controls[key].disable(); // disabling control removes its value, for some reason
                }
                if (formRow.controls['year' + yearIndex + 'Edited'].value === true) {
                  formRow.controls[key].markAsDirty(); // mark field as ng-dirty i.e. user edited
                  this.storeIndex(rowIndex); // mark row as containing user info
                }
                yearIndex++;
              }
            });
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
                  // console.debug('CCCCHANGES rowindex = ', rowIndex);
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
    }
  }

  get industryArray(): UntypedFormArray {
    return this.form.get('items')['controls'] as UntypedFormArray;
  }

  private createIndustryGroup(item: IndustryInformation): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      isEditable: [item.isEditable, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
      year0Formula: item.year0Formula,
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year1Default: [Number(item.year1Default), []],
      year1Formula: item.year1Formula,
      year2: [Number(item.year2), []],
      year2Edited: [Boolean(item.year2Edited), []],
      year2Default: [Number(item.year2Default), []],
      year2Formula: item.year2Formula,
      year3: [Number(item.year3), []],
      year3Edited: [Boolean(item.year3Edited), []],
      year3Default: [Number(item.year3Default), []],
      year3Formula: item.year3Formula,
      year4: [Number(item.year4), []],
      year4Edited: [Boolean(item.year4Edited), []],
      year4Default: [Number(item.year4Default), []],
      year4Formula: item.year4Formula,
      year5: [Number(item.year5), []],
      year5Edited: [Boolean(item.year5Edited), []],
      year5Default: [Number(item.year5Default), []],
      year5Formula: item.year5Formula,
      year6: [Number(item.year6), []],
      year6Edited: [Boolean(item.year6Edited), []],
      year6Default: [Number(item.year6Default), []],
      year6Formula: item.year6Formula,
      year7: [Number(item.year7), []],
      year7Edited: [Boolean(item.year7Edited), []],
      year7Default: [Number(item.year7Default), []],
      year7Formula: item.year7Formula,
      year8: [Number(item.year8), []],
      year8Edited: [Boolean(item.year8Edited), []],
      year8Default: [Number(item.year8Default), []],
      year8Formula: item.year8Formula,
      year9: [Number(item.year9), []],
      year9Edited: [Boolean(item.year9Edited), []],
      year9Default: [Number(item.year9Default), []],
      year9Formula: item.year9Formula,
    });
  }

  public ngOnInit(): void {
    this.intSideNavService.setCurrentStepperPosition(this.pageStepperPosition);
    this.initFormWatcher();
  }

  public confirmAndContinue(): void {
    this.interventionDataService.interventionPageConfirmContinue();
  }

  public resetForm() {
    // set fields to default values as delivered per api
    this.form.controls.items['controls'].forEach((formRow: FormGroup) => {
      let yearIndex = 0;
      Object.keys(formRow.controls).forEach((key: string) => {
        if (key === 'year' + yearIndex) {
          if (formRow.controls['year' + yearIndex + 'Default'].value !== formRow.controls['year' + yearIndex].value) {
            formRow.controls[key].setValue(formRow.controls['year' + yearIndex + 'Default'].value); // set the default value
          }
          yearIndex++;
        }
      });
    });
    //on reset mark forma as pristine to remove blue highlights
    this.form.markAsPristine();
    //remove dirty indexes to reset button to GFDx input
    this.dirtyIndexes.splice(0);
  }

  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
  }

  public recalculateChanges(): void {
    // getRawValue returns values even if cell is marked as disabled
    const allItems: Array<IndustryInformation> = this.form.getRawValue().items;

    // find all the rows which have formulas to calculate their new value
    const allItemsWithRowFormulas = this.dataSource.data.filter(
      (item: IndustryInformation) => item.isEditable === false,
    );

    // loop through all the rows with formulas to calculate their new values
    allItemsWithRowFormulas.forEach((item: IndustryInformation) => {
      const rowWantToUpdate = item.rowIndex;

      for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
        if (!item['year' + columnIndex + 'Formula']) {
          // if isEditable = true AND no yearXFormula exists, calculated value by vars outside this endpoint
          return;
        }
        // calculate the result of the formula using the inputs describes in jsonlogic
        const theResult = this.jsonLogicService.calculateResult(item, columnIndex, allItems);

        // Loop through each row of the table
        this.form.controls.items['controls'].forEach((formRow: FormGroup, rowIndex: number) => {
          // Find the row which contains the column we want to update with the new value
          if (formRow.value['rowIndex'] == rowWantToUpdate) {
            // Loop through all the columns in this row to find the cell we want to update
            Object.keys(formRow.controls).forEach((key: string) => {
              // Once find the cell, update its value with the newly calculated on
              if (key === 'year' + columnIndex) {
                const dynamicYearColumn = 'year' + columnIndex;
                // Update the value stored in the form with the new value
                this.form.controls.items['controls'][rowIndex].patchValue({ [dynamicYearColumn]: theResult });
              }
            });
          }
        });
      }
    });
  }
}
