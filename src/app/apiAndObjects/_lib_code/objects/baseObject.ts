import moment from 'moment-es6';
import { ObjectAccessor } from './objectAccessor';

/**
 * Basic object that is used as a base for objects that are returned from implements Endpoints.
 */
export class BaseObject {
  /**
   * @param _sourceObject raw data object
   * @param otherArgs Offer the possibility of passing in further arguments in extending classes.
   */
  protected constructor(
    protected readonly _sourceObject?: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...otherArgs: Array<unknown>
  ) {
    this._sourceObject = null == this._sourceObject ? {} : this._sourceObject;
  }

  /**
   * Factory method for calling the constructor and validating the raw data object.
   *
   * @param source raw data object
   * @param dictionaries An Array of dictionaries that are required to build this object
   * @returns A Promise for the object that will be resolved when it has been fully built
   */
  public static constructObject(source?: Record<string, unknown>): Promise<BaseObject> {
    return Promise.resolve(this.validateObject(source) ? new this(source) : null);
  }

  /**
   * Override this method to implement validation of the raw data used to create this object
   *
   * @param source raw data object
   * @returns Whether valid or not.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static validateObject(source: Record<string, unknown>): boolean {
    return true;
  }

  /**
   * Returns the value for the first key in the array that exists on the source object.
   *
   * @param keys string or array of strings with the first being the prefered value to retrieve.
   * @param source raw data object that the key will be looked for on. Defaults to _sourceObject
   * if not provided.
   * @returns The value for the first key in the array that exists on the source object.
   */
  protected _getValue(keys: string | Array<string>, source?: Record<string, unknown>): unknown {
    return ObjectAccessor.getValue(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns a string
   */
  protected _getString(keys: string | Array<string>, source?: Record<string, unknown>): string {
    return ObjectAccessor.getString(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns a number
   */
  protected _getNumber(keys: string | Array<string>, source?: Record<string, unknown>): number {
    return ObjectAccessor.getNumber(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns an Array
   */
  protected _getArray<T>(keys: string | Array<string>, source?: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getArray(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns a moment
   */
  protected _getDate(keys: string | Array<string>, source?: Record<string, unknown>): moment.Moment {
    return ObjectAccessor.getDate(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns a boolean
   */
  protected _getBoolean(keys: string | Array<string>, source?: Record<string, unknown>): boolean {
    return ObjectAccessor.getBoolean(keys, this._getSource(source));
  }
  /**
   * Same as _getValue but returns an enumerator value from the supplied enumerator
   *
   * @param enumerator Enumerator to find the value from
   */
  protected _getEnum<T>(key: string, enumerator: Record<string, string>, source?: Record<string, unknown>): T {
    return ObjectAccessor.getEnum<T>(key, enumerator, this._getSource(source));
  }
  /**
   * Same as _getEnum but returns an Array of enumerator values
   */
  protected _getEnums<T>(key: string, enumerator: Record<string, unknown>, source?: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getEnums<T>(key, enumerator, this._getSource(source));
  }
  /**
   * Similar to _getEnum but uses a value, not a key (which gets the value from a source object)
   */
  protected _getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    return ObjectAccessor.getEnumFromValue<T>(value, enumerator);
  }
  /**
   * Same as _getEnumFromValue but for an array of values.
   */
  protected _getEnumsFromValues<T>(values: Array<string | number>, enumerator: Record<string, unknown>): Array<T> {
    return ObjectAccessor.getEnumsFromValues<T>(values, enumerator);
  }
  /**
   * @param source raw data object
   * @returns The whole source object. Defaults to _sourceObject if not provided.
   */
  private _getSource(source?: Record<string, unknown>): Record<string, unknown> {
    return null == source ? this._sourceObject : source;
  }
}
