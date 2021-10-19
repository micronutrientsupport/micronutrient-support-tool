import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class MapDownloadService {
  private basemapImgPdfSrc = new Subject();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public basemapImgPdfObs = this.basemapImgPdfSrc.asObservable();

  constructor() {}

  public exportMapAsPDF(): void {
    return this.basemapImgPdfSrc.next();
  }

  public captureElementAsPDF(mapData: HTMLDivElement, id: string): void {
    void html2canvas(mapData, {
      useCORS: true,
      onclone: async () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
    }).then((canvas) => {
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const positionTop = 20;
      const positionLeft = 20;
      pdf.addImage(contentDataURL, 'PNG', positionLeft, positionTop, imgWidth, imgHeight);
      pdf.save(`${id}.pdf`);
    });
  }
}
