import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class QuickMapsService {
  private slimSubject = new BehaviorSubject<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public slimObservable = this.slimSubject.asObservable();

  constructor() { }

  public sideNavToggle(): void {
    this.slimSubject.next(!this.slimSubject.value);
  }
}
