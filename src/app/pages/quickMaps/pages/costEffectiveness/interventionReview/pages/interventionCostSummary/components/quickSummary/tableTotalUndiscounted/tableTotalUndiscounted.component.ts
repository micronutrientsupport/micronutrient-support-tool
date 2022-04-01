import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterventionCostSummary } from 'src/app/apiAndObjects/objects/interventionCostSummary';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-quick-undiscounted-table',
  templateUrl: './tableTotalUndiscounted.component.html',
  styleUrls: ['./tableTotalUndiscounted.component.scss'],
})
export class InterventionCostSummaryQuickUndiscountedTableComponent implements OnInit {
  @Input() summaryCosts: InterventionCostSummary;

  public dataSource = new MatTableDataSource();
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
  public totalUndiscounted: number;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.summaryCosts) {
      const dataArray = [];
      dataArray.push(this.summaryCosts.summaryCosts);
      this.dataSource = new MatTableDataSource(dataArray);

      // Calculate the totals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unDiscountedValues: any[] = Object.values(this.summaryCosts.summaryCosts).splice(4, 10);
      this.totalUndiscounted = unDiscountedValues.reduce((acc, value) => acc + value, 0);
    }
  }
}
