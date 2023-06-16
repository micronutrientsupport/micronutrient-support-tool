import { Component, Input } from '@angular/core';

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
      cols.push(Math.floor(Math.random() * 9999999).toString());
    }
    // Assigns <cols> variable to a set then back to array to remove duplicates. When cols was populated it was causing deplicate values that were causing subsequent errors.
    this.columnsToDisplay = Array.from(new Set(cols));
    this.displayedColumns = Array.from(new Set(cols));

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
