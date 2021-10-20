import { Endpoint } from './endpoint.abstract';

/**
 * Extends Endpoint and adds caching functionality
 */
export abstract class CacheableEndpoint<RETURN_TYPE, PARAMS_TYPE, OBJECT_TYPE = RETURN_TYPE> extends Endpoint<
  RETURN_TYPE,
  PARAMS_TYPE,
  OBJECT_TYPE
> {
  protected useCacheByDefault = true;

  protected cachedValues = new Map<string, RETURN_TYPE>();
  protected currentCallPromise: Promise<RETURN_TYPE>;

  /**
   * Looks for a previously cached value or a current ongoing call that can be returned as a promise.
   * If none found, accessing Endpoint Call method and caches the result using the key returned from
   * the [getCacheKey]{@link #getCacheKey} method.
   *
   * @param params params used for call and cache key generation (merged with and overrides defaults)
   * @param useCache Overrides whether to use cache or not (defaults to [useCacheByDefault]{@link #useCacheByDefault})
   * @returns Promise of call data
   */
  public call(params?: PARAMS_TYPE, useCache?: boolean): Promise<RETURN_TYPE> {
    const cacheKey = this.getCacheKey(this.validateAndMergeParams(params));
    const cacheValue = this.getCacheValue(cacheKey);
    useCache = null == useCache ? this.useCacheByDefault : useCache;
    if (null != cacheValue && useCache) {
      // console.log('using cache');
      return Promise.resolve(cacheValue);
    } else if (null != this.currentCallPromise) {
      // console.log('using call same promise');
      return this.currentCallPromise;
    } else {
      // console.log('creating call promise');
      this.currentCallPromise = super.call(params).then((value: RETURN_TYPE) => {
        // set to cache
        this.setCacheValue(cacheKey, value);
        // remove promise reference
        this.currentCallPromise = null;
        return value;
      });
      return this.currentCallPromise;
    }
  }

  /**
   * Sets whether to use caching.  Can be overridden when using [call]{@link #call} function.
   *
   * @param useCache Changes default caching on/off
   * @returns This instance
   */
  protected setUseCacheByDefault(useCache: boolean): this {
    this.useCacheByDefault = useCache;
    return this;
  }

  /**
   * @param key identifier for the data required
   * @returns cached data from a previous callout if exists
   */
  protected getCacheValue(key: string): RETURN_TYPE {
    return this.cachedValues.get(key);
  }
  /**
   * Sets a cache value (normally after a successful callout)
   *
   * @param key identifier for the data required
   * @param value data value to store
   */
  protected setCacheValue(key: string, value: RETURN_TYPE): void {
    this.cachedValues.set(key, value);
  }

  /**
   * clears the current cached data
   */
  protected clearCache(): void {
    this.cachedValues.clear();
  }

  /**
   * Retrieves the key to identify a cached data within this object.
   * Usually returns an id, a concatonation of other params
   * or any static string if there is only ever one data.
   */
  protected abstract getCacheKey(params: PARAMS_TYPE): string;
}
