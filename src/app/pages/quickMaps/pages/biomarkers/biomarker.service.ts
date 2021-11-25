import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiomarkerService {
  private changeColourRampSrc = new Subject<null>();
  public changeColourRampObservable = this.changeColourRampSrc.asObservable();

  public changeColourRamp(): void {
    this.changeColourRampSrc.next();
  }
}
