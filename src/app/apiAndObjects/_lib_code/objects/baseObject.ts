import moment from 'moment-es6';
import { ObjectAccessor } from './objectAccessor';

export class BaseObject {
  protected constructor(
    protected readonly _sourceObject?: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...otherArgs: Array<unknown>
  ) {
    _sourceObject = (null == _sourceObject) ? {} : _sourceObject;
  }

  /**
   * used by object builder.
   */
  public static constructObject(
    source?: Record<string, unknown>,
  ): Promise<BaseObject> {
    return Promise.resolve(this.validateObject(source) ? new this(source) : null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static validateObject(source: Record<string, unknown>): boolean {
    return true;
  }

  /**
   * Returns the value for the first key in the array that exists.
   *
   * @param keys string or array of strings with the first being the prefered value to retrieve.
   */
  protected _getValue(keys: string | Array<string>, source?: Record<string, unknown>): unknown {
    return ObjectAccessor.getValue(keys, this._getSource(source));
  }

  protected _getString(keys: string | Array<string>, source?: Record<string, unknown>): string {
    return ObjectAccessor.getString(keys, this._getSource(source));
  }
  protected _getNumber(keys: string | Array<string>, source?: Record<string, unknown>): number {
    return ObjectAccessor.getNumber(keys, this._getSource(source));
  }
  protected _getArray<T>(keys: string | Array<string>, source?: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getArray(keys, this._getSource(source));
  }
  protected _getDate(keys: string | Array<string>, source?: Record<string, unknown>): moment.Moment {
    return ObjectAccessor.getDate(keys, this._getSource(source));
  }
  protected _getBoolean(keys: string | Array<string>, source?: Record<string, unknown>): boolean {
    return ObjectAccessor.getBoolean(keys, this._getSource(source));
  }

  protected _getEnum<T>(key: string, enumerator: Record<string, string>, source?: Record<string, unknown>): T {
    return ObjectAccessor.getEnum<T>(key, enumerator, this._getSource(source));
  }
  protected _getEnums<T>(key: string, enumerator: Record<string, unknown>, source?: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getEnums<T>(key, enumerator, this._getSource(source));
  }
  protected _getEnumsFromValues<T>(values: Array<string | number>, enumerator: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getEnumsFromValues<T>(values, enumerator);
  }
  protected _getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    return ObjectAccessor.getEnumFromValue<T>(value, enumerator);
  }

  private _getSource(source?: Record<string, unknown>): Record<string, unknown> {
    return (null == source) ? this._sourceObject : source;
  }
}
