import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/InterventionCostSummary';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-quick-discounted-table',
  templateUrl: './tableTotalDiscounted.component.html',
  styleUrls: ['./tableTotalDiscounted.component.scss'],
})
export class InterventionCostSummaryQuickDiscountedTableComponent implements OnInit {
  @Input() summaryCosts: InterventionCostSummary;

  public dataSource = new MatTableDataSource<RecurringCosts>();
  public displayHeaders = [
    'year',
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

  public totalDiscounted: number;
  public discountRate: string;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.summaryCosts) {
      const dataArray = [];
      dataArray.push(this.summaryCosts.summaryCostsDiscounted);
      this.dataSource = new MatTableDataSource(dataArray);

      // Calculate the totals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const discountedValues: any[] = Object.values(this.summaryCosts.summaryCostsDiscounted).splice(4, 10);
      this.totalDiscounted = discountedValues.reduce((acc, value) => acc + value, 0);
      this.discountRate = this.summaryCosts.discountRate;
    }
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
