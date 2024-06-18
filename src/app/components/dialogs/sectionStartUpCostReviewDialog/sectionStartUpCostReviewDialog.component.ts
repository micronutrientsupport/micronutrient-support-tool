import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
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

  public loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  public ngOnInit() {
    this.initFormWatcher();
    this.title = this.dialogData.dataIn.section;
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
      rowIndex: [item.rowIndex, []],
      rowUnits: [item.rowUnits, []],
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

  public resetForm() {
    this.interventionDataService.resetForm(this.form, this.dirtyIndexes);
  }
}
