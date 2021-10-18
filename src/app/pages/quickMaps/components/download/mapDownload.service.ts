import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDownloadService {
  // private initSrc = new BehaviorSubject<boolean>(false);
  // // eslint-disable-next-line @typescript-eslint/member-ordering
  // public initObservable = this.initSrc.asObservable();

  private basemapImgSrc = new Subject();
  private basemapImgPdfSrc = new Subject();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public basemapImgPdfObs = this.basemapImgPdfSrc.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public basemapImgObs = this.basemapImgSrc.asObservable();

  constructor() {}

  public takeBasemapScreenShot(): void {
    return this.basemapImgSrc.next();
  }
  public takeMapPDF(): void {
    return this.basemapImgPdfSrc.next();
  }
}
