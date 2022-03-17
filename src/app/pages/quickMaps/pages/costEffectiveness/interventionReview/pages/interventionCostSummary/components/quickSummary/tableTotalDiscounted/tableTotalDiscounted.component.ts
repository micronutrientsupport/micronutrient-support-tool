import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-quick-discounted-table',
  templateUrl: './tableTotalDiscounted.component.html',
  styleUrls: ['./tableTotalDiscounted.component.scss'],
})
export class InterventionCostSummaryQuickDiscountedTableComponent implements OnInit {
  @Input() recurringCost: RecurringCost;

  public dataSource = new MatTableDataSource<RecurringCosts>();
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

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
