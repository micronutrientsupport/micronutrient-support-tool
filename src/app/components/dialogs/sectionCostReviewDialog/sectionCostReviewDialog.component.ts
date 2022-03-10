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
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<CostBreakdown>) {}
  // ngOnInit(): void {}
}
