import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { InterventionDataService, InterventionForm } from 'src/app/services/interventionData.service';
import { StartUpScaleUpCostDialogSelection } from 'src/app/pages/quickMaps/pages/costEffectiveness/interventionReview/utilities/reusableCostTable/reusableCostTable.component';

@Component({
  selector: 'app-section-start-up-cost-review',
  templateUrl: './sectionStartUpCostReviewDialog.component.html',
  styleUrls: ['./sectionStartUpCostReviewDialog.component.scss'],
})
export class SectionStartUpCostReviewDialogComponent {
  public selectedCost: StartUpCosts;
  public dataSource = new MatTableDataSource<StartUpCostBreakdown>();
  public title = '';
  public displayedColumns: string[] = ['name', 'year0', 'year1'];
  public form: FormGroup;
  public formChanges: InterventionForm['formChanges'] = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpScaleUpCostDialogSelection>,
    private interventionDataService: InterventionDataService,
    private formBuilder: FormBuilder,
  ) {
    console.debug(this.dialogData);
    this.selectedCost = this.dialogData.dataIn.costs.find(
      (item) => item['section'] === this.dialogData.dataIn.selectedElement,
    );
    this.initFormWatcher();
    this.title = this.selectedCost.section;
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
      console.debug(this.dialogData);
      this.dataSource = new MatTableDataSource(this.selectedCost.costBreakdown);
      console.debug('bing');
      const startupGroupArr = this.selectedCost.costBreakdown.map((item) => {
        return this.createStartupCostGroup(item);
      });
      this.form = this.formBuilder.group({
        items: this.formBuilder.array(startupGroupArr),
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
          console.debug(value);
          this.formChanges = value;
          const newInterventionChanges = {
            ...this.interventionDataService.getInterventionDataChanges(),
            ...this.formChanges,
          };
          this.interventionDataService.setInterventionDataChanges(newInterventionChanges);
        });
    }
  }

  get startupCostArray(): FormArray {
    return this.form.get('items')['controls'] as FormArray;
  }

  private createStartupCostGroup(item: StartUpCostBreakdown): FormGroup {
    return this.formBuilder.group({
      rowIndex: [item.rowIndex, []],
      year0: [Number(item.year0), []],
      year1: [Number(item.year1), []],
    });
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }

  public confirmChanges(): void {
    this.interventionDataService.interventionPageConfirmContinue(); // send PATCH updates with changes to the table
    const newData = this.dialogData.dataIn.costs.filter(
      (item) => item['section'] !== this.dialogData.dataIn.selectedElement,
    );
    console.debug(this.dataSource.data);
    const selectedCost: StartUpCosts = {
      section: this.selectedCost.section,
      costBreakdown: this.dataSource.data,
      year0Total: this.selectedCost.year0Total,
      year1Total: this.selectedCost.year1Total,
    };
    newData.push(selectedCost);
    console.debug(newData);
    // const originalInput = this.dialogData.dataIn;
    // const updatedInput = this.dialogData
    // this.interventionDataService.interventionStartupCostChanged(this.dataSource.data); // trigger dialog source page to update content
    this.dialogData.close();
  }
}
