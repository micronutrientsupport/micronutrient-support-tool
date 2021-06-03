import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { biomarkerInfo } from 'src/app/apiAndObjects/objects/biomarkerInfo';
import { HouseholdHistogramData } from 'src/app/apiAndObjects/objects/householdHistogramData';

import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { ProjectedAvailability } from 'src/app/apiAndObjects/objects/projectedAvailability';
import { ProjectedFoodSourcesData } from 'src/app/apiAndObjects/objects/projectedFoodSources';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';

import { ExportService } from 'src/app/services/export.service';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../pages/expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent implements OnInit {
  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;
  // users = [];
  @Input() csvObject: Array<
    | MonthlyFoodGroup
    | HouseholdHistogramData
    | ProjectedAvailability
    | ProjectedFoodSourcesData
    | biomarkerInfo
    | SubRegionDataItem
    | TopFoodSource
  >;

  constructor(private exportService: ExportService) {}

  ngOnInit(): void {
    // this.users = [
    //   {
    //     id: 1,
    //     firstName: 'Mark',
    //     lastName: 'Otto',
    //     handle: '@mdo',
    //   },
    //   {
    //     id: 2,
    //     firstName: 'Jacob',
    //     lastName: 'Thornton',
    //     handle: '@fat',
    //   },
    //   {
    //     id: 3,
    //     firstName: 'Larry',
    //     lastName: 'the Bird',
    //     handle: '@twitter',
    //   },
    // ];
  }
  // exportToCsv(): void {
  //   this.exportService.exportToCsv(this.csvObject, 'user-data', ['id', 'firstName', 'lastName', 'handle']);
  // }
  exportToCsv(): void {
    this.exportService.exportToCsv(this.csvObject);
  }
}

// export const downloadObject = new DownloadObject();
// // | HouseholdHistogramData()
// // | ProjectedAvailability()
// // | ProjectedFoodSourcesData()
// // | biomarkerInfo()
// // | SubRegionDataItem();

// export interface DownloadObject {
//   downloadObject:
//     | MonthlyFoodGroup
//     | HouseholdHistogramData
//     | ProjectedAvailability
//     | ProjectedFoodSourcesData
//     | biomarkerInfo
//     | SubRegionDataItem;
// }
