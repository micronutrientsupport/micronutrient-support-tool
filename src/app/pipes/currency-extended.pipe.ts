import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyExtended',
})
export class CurrencyExtendedPipe extends CurrencyPipe implements PipeTransform {
  constructor() {
    super('en-US');
  }

  transform(
    value: number | string,
    // currencyCode?: string,
    // display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    // digitsInfo?: string,
    // locale?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    console.log(value);
    if (value === null) {
      return super.transform(0);
    }
    return super.transform(value);
  }
}
