import { Injector } from '@angular/core';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';

export abstract class Converter<T = unknown> {
  protected item: T;
  protected stringValue: string;

  constructor(public readonly queryStringkey: QuickMapsQueryParamKey) {}

  public setItem(item: T): this {
    this.item = item;
    this.stringValue = null;
    return this;
  }
  public setString(stringValue: string): this {
    this.stringValue = stringValue;
    this.item = null;
    return this;
  }
  public abstract getString(): string;
  public abstract getItem(injector?: Injector, ...dependencies: Array<Promise<unknown>>): Promise<T>;
}
