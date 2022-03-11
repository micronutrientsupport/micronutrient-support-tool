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
export class RecurringCostTableComponent implements OnInit {
  @Input() recurringCost?: RecurringCost;
  @Input() startUpScaleUpCost?: StartUpScaleUpCost;
  @Input() headers: Array<string>;

  public dataSource = new MatTableDataSource<RecurringCosts | StartUpCosts>();

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.recurringCost) {
      this.dataSource = new MatTableDataSource(this.recurringCost.costs);
    }
    if (null != this.startUpScaleUpCost) {
      this.dataSource = new MatTableDataSource(this.startUpScaleUpCost.costs);
    }
  }

  public openSectionCostReviewDialog(costs: RecurringCosts | RecurringCosts): void {
    this.dialogService.openSectionCostReviewDialog(costs);
    console.debug(costs);
  }
}
