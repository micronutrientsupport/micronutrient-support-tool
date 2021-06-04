/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { biomarkerInfo } from '../apiAndObjects/objects/biomarkerInfo';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { ProjectedFoodSourcesData } from '../apiAndObjects/objects/projectedFoodSources';
import { MonthlyFoodGroup } from '../apiAndObjects/objects/monthlyFoodGroup';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';

// const CSV_EXTENSION = '.csv';
// const CSV_TYPE = 'text/plain;charset=utf-8';

@Injectable()
export class ExportService {
  constructor(private parser: Papa) {}

  public exportToCsv(
    details: Array<
      | MonthlyFoodGroup
      | TopFoodSource
      | HouseholdHistogramData
      | ProjectedAvailability
      | ProjectedFoodSourcesData
      | biomarkerInfo
      | SubRegionDataItem
    >,
  ): void {
    const detailType = details.pop();
    let csvData;
    csvData = this.parser.unparse(details, {
      header: true,
    });

    if (detailType instanceof HouseholdHistogramData) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      csvData = this.parser.unparse(detailType['data'], {
        header: true,
      });
      // console.debug('csvData:', csvData);
    }
    if (detailType instanceof ProjectedFoodSourcesData) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      csvData = this.parser.unparse(detailType['data'], {
        header: true,
      });
      // console.debug('csvData:', csvData);
    }

    if (csvData != null) {
      let fileTitle = '';
      switch (true) {
        case detailType instanceof MonthlyFoodGroup:
          fileTitle = 'MonthlyFoodData';
          break;
        case detailType instanceof TopFoodSource:
          fileTitle = 'Top20FoodItemsData';
          break;
        case detailType instanceof HouseholdHistogramData:
          fileTitle = 'HouseholdDietarySupplyData';
          break;
        case detailType instanceof ProjectedAvailability:
          fileTitle = 'ProjectedAvailabilityData';
          break;
        case detailType instanceof ProjectedFoodSourcesData:
          fileTitle = 'ProjectionFoodSourcesData';
          break;
        case detailType instanceof biomarkerInfo:
          fileTitle = 'BiomarkerInfoData';
          break;
        case detailType instanceof SubRegionDataItem:
          fileTitle = 'MapViewData';
          break;
        default:
          fileTitle = 'MapsDataDownload';
      }

      const a = document.createElement('a');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = `${fileTitle}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
