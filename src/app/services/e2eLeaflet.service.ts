/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/dot-notation */
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
