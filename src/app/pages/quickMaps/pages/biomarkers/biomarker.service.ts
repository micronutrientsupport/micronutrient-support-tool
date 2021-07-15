import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiomarkerService {
  private changeColourRampSrc = new Subject<null>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public changeColourRampObservable = this.changeColourRampSrc.asObservable();

  constructor() {}

  public changeColourRamp(): void {
    this.changeColourRampSrc.next();
  }
}
