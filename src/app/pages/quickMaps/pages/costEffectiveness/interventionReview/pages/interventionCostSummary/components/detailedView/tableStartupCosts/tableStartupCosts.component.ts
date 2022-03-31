import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import {
  StartUpCosts,
  StartUpCostSummary,
  StartUpScaleUpCost,
} from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-intervention-cost-summary-detailed-startup-table',
  templateUrl: './tableStartupCosts.component.html',
  styleUrls: ['./tableStartupCosts.component.scss'],
})
export class InterventionCostSummaryDetailedStartupTableComponent implements OnInit {
  @Input() startUpScaleUpCosts: Array<StartUpScaleUpCost>;

  public dataSource = new MatTableDataSource<StartUpCosts>();
  public displayHeaders = ['section', 'year0Total', 'year1Total'];

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.startUpScaleUpCosts) {
      const dataArray = [];
      this.startUpScaleUpCosts.forEach((startUpCost: StartUpScaleUpCost) => {
        let year0Total = 0;
        let year1Total = 0;
        startUpCost.costs.forEach((cost: StartUpCosts) => {
          year0Total = year0Total + cost.year0Total;
          year1Total = year1Total + cost.year1Total;
        });
        const startUpCostSummary: StartUpCostSummary = {
          category: startUpCost.category,
          year0CombinedTotal: year0Total,
          year1CombinedTotal: year1Total,
        };
        dataArray.push(startUpCostSummary);
      });

      console.log(dataArray);
      this.dataSource = new MatTableDataSource(dataArray);
    }
  }

  public openSectionCostReviewDialog(costs: RecurringCosts): void {
    console.debug(costs);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}
