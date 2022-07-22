import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCosts, RecurringCostBreakdown } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogData } from '../baseDialogService.abstract';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-section-recurring-cost-review-dialog',
  templateUrl: './sectionRecurringCostReviewDialog.component.html',
  styleUrls: ['./sectionRecurringCostReviewDialog.component.scss'],
})
export class SectionRecurringCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<RecurringCostBreakdown>();
  public title = '';
  public form: FormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  public displayedColumns: string[] = [
    'name',
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DialogData<RecurringCosts>,
    private interventionDataService: InterventionDataService,
    private formBuilder: FormBuilder,
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
      console.debug('datasource = ', this.dataSource.data);
      const reucrringGroupArr = this.dialogData.dataIn.costBreakdown.map((item) => {
        return this.createRecurringCostGroup(item);
      });
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(reucrringGroupArr),
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

  get reucrringCostArray(): FormArray {
    return this.form.get('items')['controls'] as FormArray;
  }

  private createRecurringCostGroup(item: RecurringCostBreakdown): FormGroup {
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

  public getTotalCost(yearKey: string): number {
    // Only calculate the cost for items specifed as US Dollars.
    // TODO: update this to factor in percentage modifiers
    const filterItemsInDollars = this.dataSource.data.filter((cost) => cost.rowUnits === 'US dollars');
    return filterItemsInDollars.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }

  public confirmChanges(): void {
    if (Object.keys(this.formChanges).length !== 0) {
      this.interventionDataService.interventionPageConfirmContinue().then(() => {
        this.interventionDataService.interventionRecurringCostChanged(true); // trigger dialog source page to update content
        this.dialogData.close();
      });
    } else {
      this.dialogData.close();
    }
  }
}
