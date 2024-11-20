import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

// Angular titlecase pipe capitalises first character of each word, but also
// sets other characters to lower case.  This breaks acronyms like
// NaFeEDTA.  This pipe capitalises first characters of words but leaves other
// chars as they were.
@Pipe({
  name: 'capitalFirst',
})
export class CapitalFirstPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.substring(1);
      })
      .join(' ');
  }
}
