import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CostBreakdown, RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { Costs } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-recurring-cost-table',
  templateUrl: './recurringCostTable.component.html',
  styleUrls: ['./recurringCostTable.component.scss'],
})
export class RecurringCostTableComponent implements OnInit {
  @Input() recurringCost: RecurringCost;

  public dataSource = new MatTableDataSource<Costs>();
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

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.recurringCost) {
      this.dataSource = new MatTableDataSource(this.recurringCost.costs);
    }
  }

  public openSectionCostReviewDialog(costBreakdown: CostBreakdown): void {
    this.dialogService.openSectionCostReviewDialog(costBreakdown);
    console.debug(costBreakdown);
  }
}
