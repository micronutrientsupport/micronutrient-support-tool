import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  RecurringCosts,
  RecurringCostBreakdown,
  InterventionRecurringCosts,
} from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogData } from '../baseDialogService.abstract';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { JSONLogicService } from 'src/app/services/jsonlogic.service';
import { NotificationsService } from '../../notifications/notification.service';
import { DialogService } from '../dialog.service';
import { Subscription } from 'rxjs';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-section-recurring-cost-review-dialog',
  templateUrl: './sectionRecurringCostReviewDialog.component.html',
  styleUrls: ['./sectionRecurringCostReviewDialog.component.scss'],
})
export class SectionRecurringCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<RecurringCostBreakdown>();
  public title = '';
  public dirtyIndexes = [];
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public year0Total = 0;
  public year1Total = 0;

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
  ];

  private subscriptions = new Array<Subscription>();

  public isReloading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogData<RecurringCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
    private jsonLogicService: JSONLogicService,
    private notificationsService: NotificationsService,
    private dialogService: DialogService,
  ) {
    this.initFormWatcher();
    this.title = dialogData.dataIn.section;

    const activeInterventionId = this.interventionDataService.getActiveInterventionId();

    this.subscriptions.push(
      this.interventionDataService.interventionPremixCostChangedObs.subscribe((source: boolean) => {
        if (source === true) {
          if (null != activeInterventionId) {
            this.interventionDataService.interventionPremixCostChanged(false);
            this.isReloading = true;
            void this.interventionDataService
              .getInterventionRecurringCosts(activeInterventionId)
              .then((data: InterventionRecurringCosts) => {
                this.dataSource = new MatTableDataSource(data.recurringCosts[0]['costs'][0].costBreakdown);
                this.isReloading = false;
                //this.recurringCosts = data.recurringCosts;
                // console.debug('initial: ', this.recurringCosts);
              });
          }
        }
      }),
    );
  }

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
      this.dataSource = new MatTableDataSource(this.dialogData.dataIn.costBreakdown);
      // console.debug('datasource = ', this.dataSource.data);
      const reucrringGroupArr = this.dialogData.dataIn.costBreakdown.map((item) => {
        return this.createRecurringCostGroup(item);
      });
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(reucrringGroupArr),
      });

      // Mark fields as touched/dirty if they have been previously edited and stored via the API
      this.form.controls.items['controls'].forEach((formRow: FormGroup) => {
        let yearIndex = 0;
        Object.keys(formRow.controls).forEach((key: string) => {
          if (key === 'year' + yearIndex) {
            if (formRow.controls['isEditable'].value === false) {
              formRow.controls[key].disable();
            }
            if (formRow.controls['year' + yearIndex + 'Edited'].value === true) {
              formRow.controls[key].markAsDirty(); // mark field as ng-dirty i.e. user edited
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
              const rowUnits = this.form.get('items')['controls'][key]['controls'].rowUnits.value;
              if (oldState.items[key] !== newState.items[key] && oldState.items[key] !== undefined) {
                const diff = compareObjs(oldState.items[key], newState.items[key]);
                if (Array.isArray(diff) && diff.length > 0) {
                  diff.forEach((item) => {
                    if (rowUnits === 'percent') {
                      if (changes[rowIndex]) {
                        changes[rowIndex] = {
                          ...changes[rowIndex],
                          [item[0]]: Number(item[1]) / 100,
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      } else {
                        changes[rowIndex] = {
                          [item[0]]: Number(item[1]) / 100,
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      }
                    } else {
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
    }
  }

  get reucrringCostArray(): UntypedFormArray {
    return this.form.get('items')['controls'] as UntypedFormArray;
  }

  public openPremixCalculator() {
    this.dialogService.openPremixCostReviewDialog(null);
  }

  private createRecurringCostGroup(item: RecurringCostBreakdown): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      rowUnits: [item.rowUnits, []],
      isEditable: [item.isEditable, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year1Default: [Number(item.year1Default), []],
      year2: [Number(item.year2), []],
      year2Edited: [Boolean(item.year2Edited), []],
      year2Default: [Number(item.year2Default), []],
      year3: [Number(item.year3), []],
      year3Edited: [Boolean(item.year3Edited), []],
      year3Default: [Number(item.year3Default), []],
      year4: [Number(item.year4), []],
      year4Edited: [Boolean(item.year4Edited), []],
      year4Default: [Number(item.year4Default), []],
      year5: [Number(item.year5), []],
      year5Edited: [Boolean(item.year5Edited), []],
      year5Default: [Number(item.year5Default), []],
      year6: [Number(item.year6), []],
      year6Edited: [Boolean(item.year6Edited), []],
      year6Default: [Number(item.year6Default), []],
      year7: [Number(item.year7), []],
      year7Edited: [Boolean(item.year7Edited), []],
      year7Default: [Number(item.year7Default), []],
      year8: [Number(item.year8), []],
      year8Edited: [Boolean(item.year8Edited), []],
      year8Default: [Number(item.year8Default), []],
      year9: [Number(item.year9), []],
      year9Edited: [Boolean(item.year9Edited), []],
      year9Default: [Number(item.year9Default), []],
    });
  }

  public getTotalCost(yearKey: string): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers
    const filterItemsInDollars = this.dataSource.data.filter((cost) => cost.rowUnits === 'US dollars');
    return filterItemsInDollars.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }

  public confirmChanges(): void {
    if (Object.keys(this.interventionDataService.getInterventionDataChanges()).length !== 0) {
      this.interventionDataService.interventionPageConfirmContinue().then(() => {
        this.interventionDataService.interventionRecurringCostChanged(true); // trigger dialog source page to update content
        this.dialogData.close();
      });
    } else {
      this.dialogData.close();
    }
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
  }

  public storeIndex(index: number) {
    this.dirtyIndexes.push(index);
  }

  public copyAcross(index: number, year: number) {
    console.log('Copy across from ', index);
    console.log(this.form.getRawValue().items);

    const cellVal = this.form.getRawValue().items[index]['year' + year];

    // Set values for all cells to the right, and dirty if neccesary
    let rowDirtied = false;
    for (let i = year; i < 10; i++) {
      const currentValue = this.form.controls.items['controls'][index].getRawValue()['year' + i];
      this.form.controls.items['controls'][index].patchValue({ ['year' + i]: cellVal });
      if (currentValue != cellVal) {
        this.form.controls.items['controls'][index]['controls']['year' + i].markAsDirty();
        rowDirtied = true;
      }
    }

    if (rowDirtied) {
      this.storeIndex(index);
    }
    this.recalculateChanges();
  }

  public getRawFormValues(): Array<RecurringCostBreakdown> {
    // getRawValue returns values even if cell is marked as disabled
    const allItemsRaw: Array<RecurringCostBreakdown> = this.form.getRawValue().items;

    // Ensure that when passing the raw form values to jsonLogic
    // that percentages are set back to decimal values
    const allItems = allItemsRaw.map((item) => {
      if (item.rowUnits == 'percent') {
        item.year0 = Number(item.year0) / 100;
        item.year1 = item.year1 / 100;
      }
      if (item.rowUnits == 'US dollars') {
        item.year0 = this.formatPlain(String(item.year0));
        item.year1 = this.formatPlain(String(item.year1));
        item.year2 = this.formatPlain(String(item.year2));
        item.year3 = this.formatPlain(String(item.year3));
        item.year4 = this.formatPlain(String(item.year4));
        item.year5 = this.formatPlain(String(item.year5));
        item.year6 = this.formatPlain(String(item.year6));
        item.year7 = this.formatPlain(String(item.year7));
        item.year8 = this.formatPlain(String(item.year8));
        item.year9 = this.formatPlain(String(item.year9));
      }
      return item;
    });

    return allItems;
  }

  private reverseFormatNumber(val, locale) {
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  }

  public formatPlain(value: string) {
    if (value.startsWith('$')) {
      const plainCurrency = this.reverseFormatNumber(value.substr(1), 'en-US');
      //console.log(`${value} -> ${plainCurrency}`);
      return plainCurrency;
    }
    return value;
  }

  public updatePlainCurrency(event, index: number, row: number) {
    const value = String(event.target.value);
    const plainCurrency = this.formatPlain(value);
    this.form.controls.items['controls'][index].patchValue({ ['year' + row]: plainCurrency });
  }

  public formatDollar(value: string | number) {
    if (typeof value === 'number' || !value.startsWith('$')) {
      const formattedCurrency = '$' + new Intl.NumberFormat('en-US').format(Number(value));
      //console.log(`${value} -> ${formattedCurrency}`);
      return formattedCurrency;
    }
    return value;
  }

  public updateDollarCurrency(event, index: number, row: number) {
    const value = String(event.target.value);
    const formattedCurrency = this.formatDollar(value);
    this.form.controls.items['controls'][index].patchValue({ ['year' + row]: formattedCurrency });
  }

  public recalculateChanges(): void {
    // find all the rows which have formulas to calculate their new value
    const allItemsWithRowFormulas = this.dataSource.data.filter(
      (item: RecurringCostBreakdown) => item.isEditable === false,
    );

    // loop through all the rows with formulas to calculate their new values
    allItemsWithRowFormulas.forEach((item: RecurringCostBreakdown) => {
      const rowWantToUpdate = item.rowIndex;
      // Fetch the form values each iteration to reflect updated values from previous loops
      const allItems = this.getRawFormValues();
      for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
        if (!item['year' + columnIndex + 'Formula']) {
          // if isEditable = true AND no yearXFormula exists, calculated value by vars outside this endpoint
          return;
        }
        if (Object.keys(item['year' + columnIndex + 'Formula']).length === 0) {
          // Check to see if the formula is present as expected, otherwise display static value
          console.debug('missing year' + columnIndex + 'Formula');
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
                console.log(this.form.controls.items['controls'][rowIndex]['controls']['rowUnits'].value);
                if (this.form.controls.items['controls'][rowIndex]['controls']['rowUnits'].value === 'US dollars') {
                  this.form.controls.items['controls'][rowIndex].patchValue({
                    [dynamicYearColumn]: this.formatDollar(theResult),
                  });
                } else {
                  this.form.controls.items['controls'][rowIndex].patchValue({ [dynamicYearColumn]: theResult });
                }
              }
            });
          }
        });
      }
    });
  }

  public validateUserInput(event: Event, rowIndex: number, year: string) {
    const userInput = Number((event.target as HTMLInputElement).value);
    if (userInput < 0) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 0 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    } else if (userInput > 100) {
      this.form.controls.items['controls'][rowIndex].patchValue({ [year]: 100 });
      this.notificationsService.sendInformative('Percentage input must be between 0 and 100.');
    }
  }
}
