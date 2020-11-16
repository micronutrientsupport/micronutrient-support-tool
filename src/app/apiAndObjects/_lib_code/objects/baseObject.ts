import moment from 'moment-es6';

export class BaseObject {

  protected constructor(
    protected _sourceObject?: object,
  ) {
    _sourceObject = (null == _sourceObject) ? {} : _sourceObject;
  }

  /**
   * used by object builder.
   * Can results in dictionaries being injected if required
   */

  public static makeItemFromObject(
    source?: object,
  ): BaseObject {
    return (this.validateObject(source)) ? new this(source) : null;
  }

  public static validateObject(source: object): boolean {
    return true;
  }

  public init(): Promise<this> {
    const response = this.populateValues();
    return (response instanceof Promise)
      ? response.then(() => this)
      : Promise.resolve(this);
  }

  // override to do operations when object fully built
  protected populateValues(): void | Promise<void> { }

  /**
   * Returns the value for the first key in the array that exists.
   * @param keys string or array of strings with the first being the prefered value to retrieve.
   */
  public _getValue(keys: string | Array<string>, source?: object): any {
    source = (null == source) ? this._sourceObject : source;
    keys = (typeof keys === 'string') ? [keys] : keys;
    const key = keys.find((thisKey: string, index: number) => {
      // return true if the value of this key is not null or it's the last key
      return ((null != source[thisKey]) || (index === keys.length - 1));
    });
    return source[key];
  }
  protected _getString(keys: string | Array<string>, source?: object): string {
    const value = this._getValue(keys, source);
    return (null == value) ? '' : String(value).valueOf();
  }
  protected _getNumber(keys: string | Array<string>, source?: object): number {
    return Number(this._getValue(keys, source)).valueOf();
  }
  protected _getArray<T>(keys: string | Array<string>, source?: object): Array<T> {
    const returnValue = this._getValue(keys, source) as Array<T>;
    return (null != returnValue) ? returnValue : [];
  }
  protected _getDate(keys: string | Array<string>, source?: object): moment.Moment {
    const value = this._getValue(keys, source);
    return (null == value) ? null : moment(value);
  }
  protected _getBoolean(keys: string | Array<string>, source?: object): boolean {
    const value = this._getValue(keys, source);
    return Boolean(value).valueOf();
  }

  protected _getEnum<T>(key: string, enumerator: any, source?: object): T {
    const value = this._getValue(key, source);
    return this._getEnumFromValue<T>(value, enumerator);
  }
  protected _getEnums<T>(key: string, enumerator: any, source?: object): Array<T> {
    const values = this._getArray<any>(key, source);
    return this._getEnumsFromValues<T>(values, enumerator);
  }
  protected _getEnumsFromValues<T>(values: Array<string | number>, enumerator: any): Array<T> {
    return values.map((value: string | number) => {
      return this._getEnumFromValue<T>(value, enumerator);
    });
  }
  protected _getEnumFromValue<T>(value: string | number, enumerator: any): T {
    // get the string key from the value
    const key = Object.keys(enumerator).find((thisKey: any) => {
      return (enumerator[thisKey] === value);
    });
    return enumerator[key];
  }

}
