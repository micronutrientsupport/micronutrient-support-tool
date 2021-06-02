import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
  @Input() csvObject: Array<any>;

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
