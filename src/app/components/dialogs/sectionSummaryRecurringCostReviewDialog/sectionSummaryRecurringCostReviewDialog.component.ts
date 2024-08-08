import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCosts, RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-section-summary-recurring-cost-review-dialog',
  templateUrl: './sectionSummaryRecurringCostReviewDialog.component.html',
  styleUrls: ['./sectionSummaryRecurringCostReviewDialog.component.scss'],
})
export class SectionSummaryRecurringCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<RecurringCosts>();
  public title = '';

  public displayHeaders = [
    'section',
    'year0Total',
    'year1Total',
    'year2Total',
    'year3Total',
    'year4Total',
    'year5Total',
    'year6Total',
    'year7Total',
    'year8Total',
    'year9Total',
    'source',
  ];

  public dirtyIndexes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<RecurringCost>) {
    this.dataSource = new MatTableDataSource(dialogData.dataIn.costs);
    this.title = dialogData.dataIn.category;
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
