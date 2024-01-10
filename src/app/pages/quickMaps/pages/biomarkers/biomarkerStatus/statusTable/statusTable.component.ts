import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BiomarkerCharacteristicType, BiomarkerDataType, BiomarkerStatusData } from '../biomarkerStatus.component';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomaker';

interface TableObject {
  region: string;
  n: number;
  deficient: string;
  confidence: string;
}
@Component({
  selector: 'app-status-table',
  templateUrl: './statusTable.component.html',
  styleUrls: ['./statusTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTableComponent implements OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() biomarkerData: Biomarker;
  @Input() selectedDataType: BiomarkerDataType;
  @Input() selectedCharacteristicType: BiomarkerCharacteristicType;
  @Input() biomarkerDataUpdating: boolean;

  public displayedColumns = ['region', 'n', 'deficient', 'confidence'];
  public dataSource: MatTableDataSource<TableObject>;
  public totalSamples: number;

  constructor(public quickMapsService: QuickMapsService) {}

  ngOnChanges() {
    // console.log(this.biomarkerData); // here you will get the data from parent once the input param is change
  }

  private generateTable(data: Array<BiomarkerStatusData>) {
    const n = data.length;
    const dataArray = new Array<TableObject>();

    this.totalSamples = n;

    data.forEach((item: BiomarkerStatusData) => {
      const tableObject: TableObject = {
        region: item.areaName,
        n: n,
        deficient: item.mineralLevelOne,
        confidence: item.mineralOutlier,
      };
      dataArray.push(tableObject);
    });

    this.dataSource = new MatTableDataSource(dataArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
