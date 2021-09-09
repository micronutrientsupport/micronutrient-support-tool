import { ChangeDetectionStrategy, Component, Input, AfterViewInit } from '@angular/core';
import { ExportService } from 'src/app/services/export.service';

import { Clipboard } from '@angular/cdk/clipboard';
import { Exportable } from 'src/app/apiAndObjects/objects/exportable.interface';

@Component({
  selector: 'app-status-download',
  templateUrl: './statusDownload.component.html',
  styleUrls: ['./statusDownload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDownloadComponent implements AfterViewInit {
  // public boxChartPNG: string;
  // public boxChartPDF: string;
  // public excessBarChartPNG: string;
  // public excessBarChartPDF: string;
  // public deficiencyBarChartPNG: string;
  // public deficiencyBarChartPDF: string;
  // public combinedBarChartPNG: string;
  // public combinedBarChartPDF: string;

  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;
  @Input() dataArray: Array<Exportable>;

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

  constructor(private clipboard: Clipboard, private exportService: ExportService) {}

  ngAfterViewInit(): void {}

  exportToCsv(): void {
    this.exportService.exportToCsv(this.dataArray);
  }
}
