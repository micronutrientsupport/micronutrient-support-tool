import { Endpoint } from './endpoint.abstract';

export abstract class CacheableEndpoint<RETURN_TYPE, PARAMS_TYPE, OBJECT_TYPE = RETURN_TYPE> extends Endpoint<
  RETURN_TYPE,
  PARAMS_TYPE,
  OBJECT_TYPE
> {
  protected useCacheByDefault = true;

  protected cachedValues = new Map<string, RETURN_TYPE>();
  protected currentCallPromise: Promise<RETURN_TYPE>;

  public call(params?: PARAMS_TYPE, useCache?: boolean): Promise<RETURN_TYPE> {
    const cacheKey = this.getCacheKey(this.mergeParams(params));
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
   */
  protected setUseCacheByDefault(useCache: boolean): this {
    this.useCacheByDefault = useCache;
    return this;
  }

  protected getCacheValue(key: string): RETURN_TYPE {
    return this.cachedValues.get(key);
  }

  protected setCacheValue(key: string, value: RETURN_TYPE): void {
    this.cachedValues.set(key, value);
  }

  protected clearCache(): void {
    this.cachedValues.clear();
  }

  /**
   * Retrieves the key to identify a cached response within this object.
   * Usually returns an id, a concatonation of other params
   * or any static string if there is only ever one response.
   */
  protected abstract getCacheKey(params: PARAMS_TYPE): string;
}
