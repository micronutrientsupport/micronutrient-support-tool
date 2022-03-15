import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StartUpCostBreakdown, StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-section-start-up-cost-review',
  templateUrl: './sectionStartUpCostReviewDialog.component.html',
  styleUrls: ['./sectionStartUpCostReviewDialog.component.scss'],
})
export class SectionStartUpCostReviewDialogComponent {
  public dataSource = new MatTableDataSource<StartUpCostBreakdown>();
  public title = '';

  public displayHeaders = ['name', 'year0', 'year1'];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<StartUpCosts>) {
    this.dataSource = new MatTableDataSource(dialogData.dataIn.costBreakdown);
    this.title = dialogData.dataIn.section;
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
