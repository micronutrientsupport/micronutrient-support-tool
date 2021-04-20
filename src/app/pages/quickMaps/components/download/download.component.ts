/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../pages/expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent implements OnInit {
  @Input() chartDownloadPNG: string;
  @Input() chartDownloadPDF: string;
  constructor() {}
  ngOnInit(): void {}
}
