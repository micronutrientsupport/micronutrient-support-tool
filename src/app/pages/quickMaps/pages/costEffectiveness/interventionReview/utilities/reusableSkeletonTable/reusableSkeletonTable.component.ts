import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reusable-skeleton-table',
  templateUrl: './reusableSkeletonTable.component.html',
  styleUrls: ['./reusableSkeletonTable.component.scss'],
})
export class ReusableSkeletonTableComponent {
  public displayedColumns: string[];
  public columnsToDisplay: string[];
  public data: string[] = [];

  @Input() set setData(config: SkeletonTableConfig) {
    const cols = [];
    for (let i = 0; i < config.columns; i++) {
      cols.push(Math.floor(Math.random() * 999).toString());
    }
    this.columnsToDisplay = cols;
    this.displayedColumns = cols;

    for (let i = 0; i < config.rows; i++) {
      const tempData = 'skeleton data';
      this.data.push(tempData);
    }
  }
}

export interface SkeletonTableConfig {
  columns: number;
  rows: number;
}
