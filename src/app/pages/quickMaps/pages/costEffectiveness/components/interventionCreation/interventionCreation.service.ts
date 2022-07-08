import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterventionCreationService {
  private readonly interventionLoadeSrc = new BehaviorSubject<void>(null);
  public readonly interventionLoadObs = this.interventionLoadeSrc.asObservable();

  constructor() {
    // add content
  }

  public watchInterventionLoad(): void {
    this.interventionLoadeSrc.next();
  }
}
