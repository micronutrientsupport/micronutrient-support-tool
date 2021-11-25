import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class E2ELeaflet {
  private testingObj = {};

  constructor() {
    if (null == window['testing']) {
      window['testing'] = this.testingObj;
    }
  }

  setReference(key: string, value: unknown): void {
    this.testingObj[key] = value;
  }
}
