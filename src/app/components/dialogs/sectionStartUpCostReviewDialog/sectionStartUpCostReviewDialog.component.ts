import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  makeUserCost,
  StartUpCostBreakdown,
  StartUpCosts,
  UserStartupCostFactory,
} from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, FormArray, FormGroup } from '@angular/forms';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
@Component({
  selector: 'app-section-start-up-cost-review',
  templateUrl: './sectionStartUpCostReviewDialog.component.html',
  styleUrls: ['./sectionStartUpCostReviewDialog.component.scss'],
})
export class SectionStartUpCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<StartUpCostBreakdown>();
  public title = '';
  public dirtyIndexes = [];
  public displayedColumns: string[] = ['labelText', 'year0', 'year1', 'source'];
  public baseYear = 2021;
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};
  public year0Total = 0;
  public year1Total = 0;

  public years = [0, 1];
  public loading = false;

  public isReloading = false;

  public canAddExtraCosts = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  public ngOnInit() {
    this.initFormWatcher();
    this.title = this.dialogData.dataIn.section;

    if (this.title === 'Additional Costs') {
      this.canAddExtraCosts = true;
      this.displayedColumns.push('actions');
    }
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
      const startupGroupArr = this.dialogData.dataIn.costBreakdown.map((item) => {
        return this.createStartupCostGroup(item);
      });
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(startupGroupArr),
      });
      // Mark fields as touched/dirty if they have been previously edited and stored via the API
      this.interventionDataService.setFormFieldState(this.form, this.dirtyIndexes);

      // Setup watched to track changes made to form fields and store them to the intervention
      // data service to be synced to the API when needed
      this.interventionDataService.initFormChangeWatcher(this.form, this.formChanges);
    }
  }

  get startupCostArray(): UntypedFormArray {
    return this.form.get('items')['controls'] as UntypedFormArray;
  }

  private createStartupCostGroup(item: StartUpCostBreakdown): UntypedFormGroup {
    return this.formBuilder.group({
      isDeleted: [false, []],
      rowIndex: [item.rowIndex, []],
      rowUnits: [item.rowUnits, []],
      labelText: [item.labelText, []],
      isEditable: [item.isEditable, []],
      isCalculated: [item.isCalculated, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
      year0Overriden: item.year0Overriden,
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year1Default: [Number(item.year1Default), []],
      year1Overriden: item.year1Overriden,
    });
  }

  public async confirmChanges(): Promise<boolean> {
    console.log(this.interventionDataService.getInterventionDataChanges());
    if (Object.keys(this.interventionDataService.getInterventionDataChanges()).length !== 0) {
      this.loading = true;
      this.interventionDataService.interventionPageConfirmContinue().then(() => {
        this.interventionDataService.interventionStartupCostChanged(true); // trigger dialog source page to update content
        this.dialogData.close();
        this.loading = false;
        return true;
      });
    } else {
      this.dialogData.close();
      return true;
    }
  }

  public addData() {
    const f = makeUserCost(UserStartupCostFactory, this.dataSource.data.length + 1);
    this.dataSource.data.push(f);

    //this.dataSource.data.splice(this.dataSource.data.length - 1, 0, f);
    this.dataSource.filter = '';
    const formGroup = this.createStartupCostGroup(f);
    const items = this.form.get('items') as FormArray;

    //(items.value as Array<FormGroup>).splice(items.value.length - 1, 0, formGroup);
    //items.value.splice(items.value.length - 1, 0, formGroup);
    items.push(formGroup);
  }

  public deleteRow(row) {
    const idx = this.dataSource.data.findIndex((ele) => {
      return ele.rowIndex === row.rowIndex;
    });
    this.dataSource.data.splice(idx, 1);
    this.dataSource.filter = '';
    const items = this.form.get('items') as FormArray;
    (items.controls[idx] as FormGroup).get('isDeleted').setValue(true);
    // items.controls[idx].setValue('isDeleted', true);
    items.removeAt(idx);

    // Recalc total
    this.years.map((year) => this.updateTotals(year)(null));
  }

  public updateTotals(index: number) {
    return ($event: Event) => {
      const total = this.getTotalCost('year' + index);
      const items = this.form.get('items') as FormArray;
      const res = items.controls.find((row) => row.get('isEditable').value == false);
      res.get('year' + index).setValue(this.formatDollar(total));
    };
  }

  public formatDollar(value: string | number) {
    if (typeof value === 'number' || !value.startsWith('$')) {
      const formattedCurrency = '$' + new Intl.NumberFormat('en-US').format(Number(value));
      //console.log(`${value} -> ${formattedCurrency}`);
      return formattedCurrency;
    }
    return value;
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

  public getTotalCost(yearKey: string): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers

    const items = this.form.get('items') as FormArray;

    const filterItemsInDollars = items.controls.filter(
      (cost) => cost.get('rowUnits').value === 'US dollars' && cost.get('isEditable').value == true,
    );
    return filterItemsInDollars
      .map((costBreakdown) => Number(this.formatPlain(costBreakdown.get(yearKey).value)))
      .reduce((acc, value) => {
        return acc + value;
      }, 0);
  }

  public resetForm() {
    this.interventionDataService.resetForm(this.form, this.dirtyIndexes);
  }
}
