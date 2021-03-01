import * as moment from 'moment';

export class ObjectAccessor {
  /**
   * Returns the value for the first key in the array that exists.
   *
   * @param keys string or array of strings with the first being the prefered value to retrieve.
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

  public static getString(keys: string | Array<string>, source: Record<string, unknown>): string {
    const value = this.getValue(keys, source);
    return (null == value) ? '' : String(value).valueOf();
  }
  public static getNumber(keys: string | Array<string>, source: Record<string, unknown>): number {
    return Number(this.getValue(keys, source)).valueOf();
  }
  public static getArray<T>(keys: string | Array<string>, source: Record<string, unknown>): Array<T> {
    const returnValue = this.getValue(keys, source) as Array<T>;
    return null != returnValue ? returnValue : [];
  }
  public static getDate(keys: string | Array<string>, source: Record<string, unknown>): moment.Moment {
    const value = this.getValue(keys, source);
    return null == value ? null : moment(value);
  }
  public static getBoolean(keys: string | Array<string>, source: Record<string, unknown>): boolean {
    const value = this.getValue(keys, source);
    return Boolean(value).valueOf();
  }

  public static getEnum<T>(key: string, enumerator: Record<string, string>, source: Record<string, unknown>): T {
    const value = this.getValue(key, source) as string | number;
    return this.getEnumFromValue<T>(value, enumerator);
  }
  public static getEnums<T>(key: string, enumerator: Record<string, unknown>, source: Record<string, unknown>): Array<T> {
    const values = this.getArray<any>(key, source);
    return this.getEnumsFromValues<T>(values, enumerator);
  }
  public static getEnumsFromValues<T>(values: Array<string | number>, enumerator: Record<string, unknown>): Array<T> {
    return values.map((value: string | number) => this.getEnumFromValue<T>(value, enumerator));
  }
  public static getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    // get the string key from the value
    const key = Object.keys(enumerator).find((thisKey: string | number) => enumerator[thisKey] === value);
    return enumerator[key] as T;
  }
}
