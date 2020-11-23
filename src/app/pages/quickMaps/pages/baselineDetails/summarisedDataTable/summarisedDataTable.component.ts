/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summarised-data-table',
  templateUrl: './summarisedDataTable.component.html',
  styleUrls: ['./summarisedDataTable.component.scss'],
})
export class SummarisedDataTableComponent implements OnInit {
  public displayedColumns = [];

  constructor() {}

  ngOnInit(): void {
    void this.http
      .get('./assets/dummyData/trial_data.csv', { responseType: 'text' })
      .toPromise()
      .then((data) => {
        const rawData = this.papa.parse(data, { header: true });
        const rawDataArray = rawData.data;

        rawDataArray.forEach((item) => {
          this.meatva.push(Number(item['va.meat']));
        });

        rawDataArray.forEach((item) => {
          this.totalva.push(Number(item['va.supply']));
        });

        rawDataArray.forEach((item) => {
          this.labels.push(item.pc);
        });
      });
  }
}
