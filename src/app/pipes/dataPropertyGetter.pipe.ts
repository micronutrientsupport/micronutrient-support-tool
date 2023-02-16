import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPropertyGetter',
})
export class DataPropertyGetterPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    return object[keyName];
  }
}
