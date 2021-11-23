import { Converter } from './converter.abstract';

export class StringConverter extends Converter<string> {
  public getString(): string {
    return this.item ?? '';
  }
  public getItem(): Promise<string> {
    return Promise.resolve(this.stringValue);
  }
}
