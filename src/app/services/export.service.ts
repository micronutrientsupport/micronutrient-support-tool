/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import * as FileSaver from 'file-saver';

const CSV_EXTENSION = '.csv';
const CSV_TYPE = 'text/plain;charset=utf-8';

@Injectable()
export class ExportService {
  constructor(private parser: Papa) {}
  /**
   * Creates an array of data to csv. It will automatically generate title row based on object keys.
   *
   * @param rows array of data to be converted to CSV.
   * @param fileName filename to save as.
   * @param columns array of object properties to convert to CSV. If skipped, then all object properties will be used for CSV.
   */

  // eslint-disable-next-line @typescript-eslint/ban-types
  // public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
  //   if (!rows || !rows.length) {
  //     return;
  //   }
  //   const separator = ',';
  //   const keys = Object.keys(rows[0]).filter((k) => {
  //     if (columns?.length) {
  //       return columns.includes(k);
  //     } else {
  //       return true;
  //     }
  //   });
  //   const csvContent =
  //     keys.join(separator) +
  //     '\n' +
  //     rows
  //       .map((row) =>
  //         keys
  //           .map((k) => {
  //             let cell = row[k] === null || row[k] === undefined ? '' : row[k];
  //             cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
  //             if (cell.search(/("|,|\n)/g) >= 0) {
  //               cell = `"${cell}"`;
  //             }
  //             return cell;
  //           })
  //           .join(separator),
  //       )
  //       .join('\n');
  //   this.saveAsFile(csvContent, `${fileName}${CSV_EXTENSION}`, CSV_TYPE);
  // }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public exportToCsv(details: object[]): void {
    // const exportObjectArray = new Array<ExportObject>();
    // exportObjectArray.push({
    //   clientSampleLabID: 'Lab Sample ID',
    //   labComment: 'Lab Comment',
    //   splitType: 'Split Type',
    //   location: 'Location',
    //   label: 'Label'
    // });

    // [].concat(...this.savedSamplesMap.values()).forEach((labSample: LabSample) => {
    //   const exportObject = new ExportObject();
    //   exportObject.clientSampleLabID = labSample.clientSampleLabsRef;
    //   exportObject.labComment = labSample.description;
    //   exportObject.splitType = labSample.splitType.name;
    //   exportObject.location = labSample.location.name;
    //   exportObject.label = labSample.label;
    //   exportObjectArray.push(exportObject);
    // });

    const csvData = this.parser.unparse(details, {
      header: true,
    });

    if (csvData != null) {
      const a = document.createElement('a');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = 'test.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  /**
   * Saves the file on client's machine via FileSaver library.
   *
   * @param buffer The data that need to be saved.
   * @param fileName File name to save as.
   * @param fileType File type to save as.
   */
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  }
}
