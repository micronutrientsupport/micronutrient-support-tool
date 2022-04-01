import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost, RecurringCostSummary } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-detailed-recurring-table',
  templateUrl: './tableRecurringCosts.component.html',
  styleUrls: ['./tableRecurringCosts.component.scss'],
})
export class InterventionCostSummaryDetailedRecurringTableComponent implements OnInit {
  @Input() recurringCost: Array<RecurringCost>;

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
      const dataArray = [];

      console.log(this.recurringCost);
      this.recurringCost.forEach((rc: RecurringCost) => {
        const recurringCostSummary: RecurringCostSummary = {
          category: rc.category,
          year0CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year0Total'])
            .reduce((acc, value) => acc + value, 0),
          year1CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year1Total'])
            .reduce((acc, value) => acc + value, 0),
          year2CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year2Total'])
            .reduce((acc, value) => acc + value, 0),
          year3CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year3Total'])
            .reduce((acc, value) => acc + value, 0),
          year4CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year4Total'])
            .reduce((acc, value) => acc + value, 0),
          year5CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year5Total'])
            .reduce((acc, value) => acc + value, 0),
          year6CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year6Total'])
            .reduce((acc, value) => acc + value, 0),
          year7CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year7Total'])
            .reduce((acc, value) => acc + value, 0),
          year8CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year8Total'])
            .reduce((acc, value) => acc + value, 0),
          year9CombinedTotal: rc.costs
            .map((rcs: RecurringCosts) => rcs['year9Total'])
            .reduce((acc, value) => acc + value, 0),
        };
        dataArray.push(recurringCostSummary);
      });
      this.dataSource = new MatTableDataSource(dataArray);
    }
  }

  public openSectionRecurringCostReviewDialog(category: string): void {
    const selectedRecurringCost: RecurringCost = this.recurringCost.find((obj) => {
      return obj.category === category;
    });
    console.log(selectedRecurringCost);
    this.dialogService.openSectionSummaryRecurringCostReviewDialog(selectedRecurringCost);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data
      .map((costBreakdown: RecurringCosts) => costBreakdown[yearKey])
      .reduce((acc, value) => acc + value, 0);
  }
}
