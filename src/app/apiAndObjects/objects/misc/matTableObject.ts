import { MatTableDataSource } from '@angular/material/table';

export interface MatTableObject {
  datasource: MatTableDataSource<any>;
  columnIdentifiers: Array<string>;
}
