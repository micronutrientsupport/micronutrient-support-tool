/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Exportable } from '../apiAndObjects/objects/exportable.interface';

@Injectable()
export class ExportService {
  constructor(private parser: Papa) {}

  public exportToCsv(dataArray: Array<Exportable>): void {
    const csvData = this.parser.unparse(dataArray, {
      header: true,
    });
    if (csvData != null) {
      const fileTitle = null != dataArray[0] ? dataArray[0].getExportFileName() : 'fileName';

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
