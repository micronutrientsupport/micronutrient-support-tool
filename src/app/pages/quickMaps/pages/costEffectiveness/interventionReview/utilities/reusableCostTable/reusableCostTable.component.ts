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

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (null != this.recurringCost) {
      this.dataSource = new MatTableDataSource(this.recurringCost.costs);
    }
    if (null != this.startUpScaleUpCost) {
      this.dataSource = new MatTableDataSource(this.startUpScaleUpCost.costs);
    }
  }

  public openSectionRecurringCostReviewDialog(costs: RecurringCosts): void {
    this.dialogService.openSectionRecurringCostReviewDialog(costs);
  }

  public openSectionStartUpCostReviewDialog(elementName: string): void {
    const selectedCost: StartUpScaleUpCostDialogSelection = {
      selectedElement: elementName,
      costs: this.startUpScaleUpCost.costs,
    };
    this.dialogService.openSectionStartUpCostReviewDialog(selectedCost);
  }

  public getTotalCost(yearKey: string): number {
    return this.dataSource.data.map((costBreakdown) => costBreakdown[yearKey]).reduce((acc, value) => acc + value, 0);
  }
}

export interface StartUpScaleUpCostDialogSelection {
  selectedElement: string;
  costs: Array<StartUpCosts>;
}
