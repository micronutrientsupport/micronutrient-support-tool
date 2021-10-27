import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';

export abstract class Converter<T = unknown> {
  protected item: T;
  protected stringValue: string;

  constructor(public readonly queryStringkey: QuickMapsQueryParamKey) {}

  /**
   * Sets the item and clears the string
   */
  public setItem(item: T): this {
    this.item = item;
    this.stringValue = null;
    return this;
  }
  /**
   * Sets the string and clears the item
   */
  public setString(stringValue: string): this {
    this.stringValue = stringValue;
    this.item = null;
    return this;
  }
  /**
   * Creates a string from the item
   */
  public abstract getString(): string;
  /**
   * Creates an item from the string
   */
  public abstract getItem(...dependencies: Array<unknown>): Promise<T>;
}
