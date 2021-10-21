import * as moment from 'moment';

export class ObjectAccessor {
  /**
   * Returns the value for the first key in the array that exists on the source object.
   *
   * @param keys string or array of strings with the first being the prefered value to retrieve.
   * @param source raw data object that the key will be looked for on.
   * @returns The value for the first key in the array that exists on the source object.
   */
  public static getValue(keys: string | Array<string>, source: Record<string, unknown>): unknown {
    keys = typeof keys === 'string' ? [keys] : keys;
    const key = keys.find(
      (thisKey: string, index: number) =>
        // return true if the value of this key is not null or it's the last key
        null != source[thisKey] || index === keys.length - 1,
    );
    return source[key];
  }

  /**
   * Same as _getValue but returns a string
   */
  public static getString(keys: string | Array<string>, source: Record<string, unknown>): string {
    const value = this.getValue(keys, source);
    return null == value ? '' : String(value).valueOf();
  }
  /**
   * Same as _getValue but returns a number
   */
  public static getNumber(keys: string | Array<string>, source: Record<string, unknown>): number {
    return Number(this.getValue(keys, source)).valueOf();
  }
  /**
   * Same as _getValue but returns an Array
   */
  public static getArray<T>(keys: string | Array<string>, source: Record<string, unknown>): Array<T> {
    const returnValue = this.getValue(keys, source) as Array<T>;
    return null != returnValue ? returnValue : [];
  }
  /**
   * Same as _getValue but returns a moment
   */
  public static getDate(keys: string | Array<string>, source: Record<string, unknown>): moment.Moment {
    const value = this.getValue(keys, source);
    return null == value ? null : moment(value);
  }
  /**
   * Same as _getValue but returns a boolean
   */
  public static getBoolean(keys: string | Array<string>, source: Record<string, unknown>): boolean {
    const value = this.getValue(keys, source);
    return Boolean(value).valueOf();
  }

  /**
   * Same as _getValue but returns an enumerator value from the supplied enumerator
   *
   * @param enumerator Enumerator to find the value from
   */
  public static getEnum<T>(key: string, enumerator: Record<string, string>, source: Record<string, unknown>): T {
    const value = this.getValue(key, source) as string | number;
    return this.getEnumFromValue<T>(value, enumerator);
  }
  /**
   * Same as _getEnum but returns an Array of enumerator values
   */
  public static getEnums<T>(
    key: string,
    enumerator: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Array<T> {
    const values = this.getArray<string | number>(key, source);
    return this.getEnumsFromValues<T>(values, enumerator);
  }
  /**
   * Similar to _getEnum but uses a value, not a key (which gets the value from a source object)
   */
  public static getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    // get the string key from the value
    const key = Object.keys(enumerator).find((thisKey: string | number) => enumerator[thisKey] === value);
    return enumerator[key] as T;
  }
  /**
   * Same as _getEnumFromValue but for an array of values.
   */
  public static getEnumsFromValues<T>(values: Array<string | number>, enumerator: Record<string, unknown>): Array<T> {
    return values.map((value: string | number) => this.getEnumFromValue<T>(value, enumerator));
  }
}
