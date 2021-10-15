import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class MapDownloadService {
  pdfMake: any;

  // private initSrc = new BehaviorSubject<boolean>(false);
  // // eslint-disable-next-line @typescript-eslint/member-ordering
  // public initObservable = this.initSrc.asObservable();

  private readonly basemapImgSrc = new Subject();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public basemapImgObs = this.basemapImgSrc.asObservable();

  constructor() {}

  public takeBasemapScreenShot(): void {
    return this.basemapImgSrc.next();
  }

  // public async loadPdfMaker() {
  //   if (!this.pdfMake) {
  //     const pdfMakeModule = await import('pdfmake/build/pdfmake');
  //     const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
  //     this.pdfMake = pdfMakeModule.default;
  //     this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
  //   }
  // }

  // public async generatePdf(img: any) {
  //   await this.loadPdfMaker();
  //   const def = {
  //     content: {
  //       image: `${img}`,
  //     },
  //   };
  //   this.pdfMake.createPdf(def).open();
  // }
}
