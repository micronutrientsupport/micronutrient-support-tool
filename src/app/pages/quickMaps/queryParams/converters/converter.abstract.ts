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
  public abstract getItem(injector?: Injector, dependencies?: Promise<unknown>): Promise<T>;
}

export class StringConverter extends Converter<string> {
  public getString(): string {
    return this.item ?? '';
  }
  public getItem(): Promise<string> {
    return Promise.resolve(this.stringValue);
  }
}

export class NumberConverter extends Converter<number> {
  public getString(): string {
    return null == this.item ? '' : String(this.item);
  }
  public getItem(): Promise<number> {
    return Promise.resolve(Number(this.stringValue));
  }
}
