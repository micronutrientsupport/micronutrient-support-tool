import { ChangeDetectionStrategy, Component, Input, AfterViewInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../pages/expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent implements AfterViewInit {
  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;

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

  constructor(private clipboard: Clipboard) {}

  ngAfterViewInit(): void {}
}
