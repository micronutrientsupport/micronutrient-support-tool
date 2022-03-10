import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CostBreakdown } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-section-cost-review-dialog',
  templateUrl: './sectionCostReviewDialog.component.html',
  styleUrls: ['./sectionCostReviewDialog.component.scss'],
})
export class SectionCostReviewDialogComponent {
  public dataSource = new MatTableDataSource();

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

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<Array<CostBreakdown>>) {
    this.dataSource = new MatTableDataSource(dialogData.dataIn);
  }
}
