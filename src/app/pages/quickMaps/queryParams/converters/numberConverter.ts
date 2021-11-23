import { Converter } from './converter.abstract';

export class NumberConverter extends Converter<number> {
  public getString(): string {
    return null == this.item ? '' : String(this.item);
  }
  public getItem(): Promise<number> {
    return Promise.resolve(Number(this.stringValue));
  }
}
