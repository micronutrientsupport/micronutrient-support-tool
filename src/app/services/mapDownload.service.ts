import { Injectable } from '@angular/core';
import domtoimage from 'dom-to-image';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileSaver = require('file-saver');

@Injectable({
  providedIn: 'root',
})
export class MapDownloadService {
  public captureElementAsImage(div: HTMLDivElement, filename: string): void {
    domtoimage.toBlob(div).then((blob) => {
      fileSaver.saveAs(blob, `${filename}`);
    });
  }
}
