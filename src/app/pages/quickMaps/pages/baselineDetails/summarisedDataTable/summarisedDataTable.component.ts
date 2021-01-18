/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-summarised-data-table',
  templateUrl: './summarisedDataTable.component.html',
  styleUrls: ['./summarisedDataTable.component.scss'],
})
export class SummarisedDataTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns = [
    'pc',
    'va.supply',
    'va.cergra',
    'va.tubers',
    'va.nuts',
    'va.veg',
    'va.meat',
    'va.fruit',
    'va.dairy',
    'va.fat',
    // 'va.misc',
    // 'va.vendor',
    // 'va.bev',
  ];

  public dataSource = new MatTableDataSource();
  public rawData;

  constructor(private http: HttpClient, private papa: Papa) {}

  ngOnInit(): void {
    void this.http
      .get('./assets/dummyData/trial_data.csv', { responseType: 'text' })
      .toPromise()
      .then((data) => {
        this.rawData = this.papa.parse(data, { header: true });
        this.dataSource = new MatTableDataSource(this.rawData.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
