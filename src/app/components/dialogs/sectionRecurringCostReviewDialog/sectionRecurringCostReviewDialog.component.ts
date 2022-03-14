import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-section-recurring-cost-review-dialog',
  templateUrl: './sectionRecurringCostReviewDialog.component.html',
  styleUrls: ['./sectionRecurringCostReviewDialog.component.scss'],
})
export class SectionCostReviewDialogComponent {
  public dataSource = new MatTableDataSource();
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

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<RecurringCosts>) {
    this.dataSource = new MatTableDataSource(dialogData.dataIn.costBreakdown);
    this.title = dialogData.dataIn.section;
  }
}
