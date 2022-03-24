import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-detailed-startup-table',
  templateUrl: './tableStartupCosts.component.html',
  styleUrls: ['./tableStartupCosts.component.scss'],
})
export class InterventionCostSummaryDetailedStartupTableComponent implements OnInit {
  @Input() recurringCost: RecurringCost;

  public dataSource = new MatTableDataSource<RecurringCosts>();
  public displayHeaders = ['section', 'year0Total', 'year1Total'];

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.recurringCost) {
      this.dataSource = new MatTableDataSource(this.recurringCost.costs);
    }
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }
}