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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (value === null) {
      return super.transform(0);
    }
    return super.transform(value, 'USD', 'symbol', '1.0-0');
  }
}
