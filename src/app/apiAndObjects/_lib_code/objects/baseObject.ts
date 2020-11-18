import moment from 'moment-es6';

export class BaseObject {
  protected constructor(protected _sourceObject?: Record<string, unknown>) {
    _sourceObject = null == _sourceObject ? {} : _sourceObject;
  }

  /**
   * used by object builder.
   * Can results in dictionaries being injected if required
   */
  public static makeItemFromObject(source?: Record<string, unknown>): BaseObject {
    return this.validateObject(source) ? new this(source) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static validateObject(source: Record<string, unknown>): boolean {
    return true;
  }

  public init(): Promise<this> {
    const response = this.populateValues();
    return response instanceof Promise ? response.then(() => this) : Promise.resolve(this);
  }
  /**
   * Returns the value for the first key in the array that exists.
   *
   * @param keys string or array of strings with the first being the prefered value to retrieve.
   */
  public _getValue(keys: string | Array<string>, source?: Record<string, unknown>): unknown {
    source = null == source ? this._sourceObject : source;
    keys = typeof keys === 'string' ? [keys] : keys;
    const key = keys.find(
      (thisKey: string, index: number) =>
        // return true if the value of this key is not null or it's the last key
        null != source[thisKey] || index === keys.length - 1,
    );
    return source[key];
  }

  // override to do operations when object fully built
  protected populateValues(): void | Promise<void> {}

  protected _getString(keys: string | Array<string>, source?: Record<string, unknown>): string {
    const value = this._getValue(keys, source);
    return null == value ? '' : String(value).valueOf();
  }
  protected _getNumber(keys: string | Array<string>, source?: Record<string, unknown>): number {
    return Number(this._getValue(keys, source)).valueOf();
  }
  protected _getArray<T>(keys: string | Array<string>, source?: Record<string, unknown>): Array<T> {
    const returnValue = this._getValue(keys, source) as Array<T>;
    return null != returnValue ? returnValue : [];
  }
  protected _getDate(keys: string | Array<string>, source?: Record<string, unknown>): moment.Moment {
    const value = this._getValue(keys, source);
    return null == value ? null : moment(value);
  }
  protected _getBoolean(keys: string | Array<string>, source?: Record<string, unknown>): boolean {
    const value = this._getValue(keys, source);
    return Boolean(value).valueOf();
  }

  protected _getEnum<T>(key: string, enumerator: Record<string, string>, source?: Record<string, unknown>): T {
    const value = this._getValue(key, source) as string | number;
    return this._getEnumFromValue<T>(value, enumerator);
  }
  protected _getEnums<T>(key: string, enumerator: Record<string, unknown>, source?: Record<string, unknown>): Array<T> {
    const values = this._getArray<any>(key, source);
    return this._getEnumsFromValues<T>(values, enumerator);
  }
  protected _getEnumsFromValues<T>(values: Array<string | number>, enumerator: Record<string, unknown>): Array<T> {
    return values.map((value: string | number) => this._getEnumFromValue<T>(value, enumerator));
  }
  protected _getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    // get the string key from the value
    const key = Object.keys(enumerator).find((thisKey: string | number) => enumerator[thisKey] === value);
    return enumerator[key] as T;
  }
}
