import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BiomarkerStatusService {
  private messageSource = new BehaviorSubject<string>('default message');
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentMessage = this.messageSource.asObservable();
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
