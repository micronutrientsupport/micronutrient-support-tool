import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { Costs } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-quick-undiscounted-table',
  templateUrl: './tableTotalUndiscounted.component.html',
  styleUrls: ['./tableTotalUndiscounted.component.scss'],
})
export class InterventionCostSummaryQuickUndiscountedTableComponent implements OnInit {
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

  public openSectionCostReviewDialog(costs: Costs): void {
    console.debug(costs);
  }
}
