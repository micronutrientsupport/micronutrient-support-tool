/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import domtoimage from 'dom-to-image';

const fileSaver = require('file-saver');

@Injectable({
  providedIn: 'root',
})
export class MapDownloadService {
  constructor() {}

  public captureElementAsImage(div: HTMLDivElement, filename: string): void {
    domtoimage.toBlob(div).then((blob) => {
      fileSaver.saveAs(blob, `${filename}`);
    });
  }
}
