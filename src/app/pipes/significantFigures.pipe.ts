import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sigFig' })
export class SignificantFiguresPipe implements PipeTransform {
  public transform(value: number | string, precision: number): string {
    const num = Number(value);
    return isNaN(num) ? value.toString() : num.toPrecision(precision);
  }
}
