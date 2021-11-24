import { Component, Input } from '@angular/core';
import { ExportService } from 'src/app/services/export.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Exportable } from 'src/app/apiAndObjects/objects/exportable.interface';
import { BiomarkerDataType, BiomarkerMediaType } from '../biomarkerStatus.component';

@Component({
  selector: 'app-status-download',
  templateUrl: './statusDownload.component.html',
  styleUrls: ['./statusDownload.component.scss'],
})
export class StatusDownloadComponent {
  @Input() set biomarkerData(micronutrientName: string) {
    if (null != micronutrientName) {
      this.micronutirentName = micronutrientName;
    }
  }
  @Input() set selectedDataType(dataType: BiomarkerDataType) {
    if (null != dataType) {
      this.selectedDataOption = dataType.value;
    }
  }
  @Input() set selectedMediaType(mediaType: BiomarkerMediaType) {
    if (null != mediaType) {
      this.selectedMediaOption = mediaType.value;
    }
  }
  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;
  @Input() dataArray: Array<Exportable>;

  message: string;
  public selectedDataOption;
  public selectedMediaOption;
  public micronutirentName: string;
  // public boxChartPNG: string;
  // public boxChartPDF: string;
  // public excessBarChartPNG: string;
  // public excessBarChartPDF: string;
  // public deficiencyBarChartPNG: string;
  // public deficiencyBarChartPDF: string;
  // public combinedBarChartPNG: string;
  // public combinedBarChartPDF: string;

  public year = new Date().getFullYear();
  public date = new Date();
  public formattedDate = this.date
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, ' ');

  public copyPlainText =
    'MAPS' +
    `(${this.year})` +
    ' The Micronutrient Action Policy Support (MAPS) Tool project. https://tool.micronutrient.support/ Accessed: ' +
    `${this.formattedDate}`;

  public copyBibTex =
    '@misc{MAPS' +
    `(${this.year})` +
    '\n' +
    'author = {{The Micronutrient Action Policy Support (MAPS) Tool project}},' +
    '\n' +
    'title = {The Micronutrient Action Policy Support (MAPS) Tool project},' +
    '\n' +
    'year = {2021},' +
    '\n' +
    'note = {[Online; accessed ' +
    `${this.formattedDate}` +
    ']},' +
    '\n' +
    'url = {https://tool.micronutrient.support/}' +
    '\n' +
    '}';

  constructor(private exportService: ExportService, private clipboard: Clipboard) {}

  exportToCsv(): void {
    this.exportService.exportToCsv(this.dataArray);
  }
}
