/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { biomarkerInfo } from '../apiAndObjects/objects/biomarkerInfo';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { ProjectedFoodSourcesData } from '../apiAndObjects/objects/projectedFoodSources';
import { MonthlyFoodGroup } from '../apiAndObjects/objects/monthlyFoodGroup';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';
import { stubTrue } from 'cypress/types/lodash';

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
    const csvData = this.parser.unparse(details, {
      header: true,
    });

    if (csvData != null) {
      const detailType = details.pop();
      let fileTitle = '';
      switch (true) {
        case detailType instanceof MonthlyFoodGroup:
          fileTitle = 'MonthlyFoodGroup';
          break;
        case detailType instanceof TopFoodSource:
          fileTitle = 'TopFoodSource';
          break;
        case detailType instanceof HouseholdHistogramData:
          fileTitle = 'HouseholdHistogramData';
          break;
        case detailType instanceof ProjectedAvailability:
          fileTitle = 'ProjectedAvailability';
          break;
        case detailType instanceof ProjectedFoodSourcesData:
          fileTitle = 'ProjectedFoodSourcesData';
          break;
        case detailType instanceof biomarkerInfo:
          fileTitle = 'biomarkerInfo';
          break;
        case detailType instanceof SubRegionDataItem:
          fileTitle = 'SubRegionDataItem';
          break;
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
