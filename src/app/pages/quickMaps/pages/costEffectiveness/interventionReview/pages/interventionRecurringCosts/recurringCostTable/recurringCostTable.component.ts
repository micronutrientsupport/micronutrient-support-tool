import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecurringCost } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { Costs } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';

@Component({
  selector: 'app-recurring-cost-table',
  templateUrl: './recurringCostTable.component.html',
  styleUrls: ['./recurringCostTable.component.scss'],
})
export class RecurringCostTableComponent implements OnInit {
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

  // constructor() {}

  ngOnInit(): void {
    console.debug(this.recurringCost);
    if (null != this.recurringCost) {
      this.dataSource = new MatTableDataSource(this.recurringCost.costs);
    }
  }
}
