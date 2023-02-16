import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, FormGroup } from '@angular/forms';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';

@Component({
  selector: 'app-section-start-up-cost-review',
  templateUrl: './sectionStartUpCostReviewDialog.component.html',
  styleUrls: ['./sectionStartUpCostReviewDialog.component.scss'],
})
export class SectionStartUpCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<StartUpCostBreakdown>();
  public title = '';
  public displayedColumns: string[] = ['name', 'year0', 'year1'];
  public form: UntypedFormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.initFormWatcher();
    this.title = dialogData.dataIn.section;
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
      this.form.controls.items['controls'].forEach((formRow: FormGroup) => {
        let yearIndex = 0;
        Object.keys(formRow.controls).forEach((key: string) => {
          if (key === 'year' + yearIndex) {
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
    }
  }

  get startupCostArray(): UntypedFormArray {
    return this.form.get('items')['controls'] as UntypedFormArray;
  }

  private createStartupCostGroup(item: StartUpCostBreakdown): UntypedFormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [Number(item.year0), []],
      year0Edited: [Boolean(item.year0Edited), []],
      year0Default: [Number(item.year0Default), []],
      year1: [Number(item.year1), []],
      year1Edited: [Boolean(item.year1Edited), []],
      year1Default: [Number(item.year1Default), []],
    });
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }

  public confirmChanges(): void {
    if (Object.keys(this.formChanges).length !== 0) {
      this.interventionDataService.interventionPageConfirmContinue().then(() => {
        this.interventionDataService.interventionStartupCostChanged(true); // trigger dialog source page to update content
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
  }
}
