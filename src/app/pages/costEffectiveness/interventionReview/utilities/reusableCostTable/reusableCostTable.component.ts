import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost, RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { StartUpCosts, StartUpScaleUpCost } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-reusable-cost-table',
  templateUrl: './reusableCostTable.component.html',
  styleUrls: ['./reusableCostTable.component.scss'],
})
export class ReusableCostTableComponent implements OnInit {
  @Input() recurringCost?: RecurringCost;
  @Input() startUpScaleUpCost?: StartUpScaleUpCost;
  @Input() headers: Array<string>;

  public dataSource = new MatTableDataSource<RecurringCosts | StartUpCosts>();

  public baseYear = 2021;

  public years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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
      const years = [];
      const displayYears = ['section'];
      for (let i = 0; i < 10; i++) {
        if (this.recurringCost.costs[0].costBreakdown[0]['year' + i] === null) {
          break;
        } else {
          years.push(i);
          displayYears.push('year' + i + 'Total');
        }
      }
      this.years = years;
      this.displayHeaders = displayYears;
    }
    if (null != this.startUpScaleUpCost) {
      this.dataSource = new MatTableDataSource(this.startUpScaleUpCost.costs);
    }
  }

  public openPremixCostReviewDialog(costs: RecurringCosts): void {
    this.dialogService.openPremixCostReviewDialog(costs);
  }

  public openSectionRecurringCostReviewDialog(costs: RecurringCosts): void {
    this.dialogService.openSectionRecurringCostReviewDialog(costs);
  }

  public openSectionStartUpCostReviewDialog(costs: StartUpCosts): void {
    this.dialogService.openSectionStartUpCostReviewDialog(costs);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
