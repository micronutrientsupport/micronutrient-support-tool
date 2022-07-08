import { Component, Inject, Injectable, Self } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCosts, RecurringCostBreakdown } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DecimalInputDirective } from 'src/app/directives/decimalInput.directive';
import { DialogData } from '../baseDialogService.abstract';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-section-recurring-cost-review-dialog',
  templateUrl: './sectionRecurringCostReviewDialog.component.html',
  styleUrls: ['./sectionRecurringCostReviewDialog.component.scss'],
})
export class SectionRecurringCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<RecurringCostBreakdown>();
  public title = '';

  public displayHeaders = [
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
  ) // private decDirective: DecimalInputDirective,
  {
    this.dataSource = new MatTableDataSource(dialogData.dataIn.costBreakdown);
    this.title = dialogData.dataIn.section;
    console.log('recurringCosts:', this.dataSource.data);
    console.log('recurringCosts Average salary of commercial monitor year7:', this.dataSource.data[0].year7.toFixed(2));
    // console.log('CustomAppComponent: Injected directive: ', this.decDirective);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
