import { CacheableEndpoint } from './cacheableEndpoint.abstract';
import { DictionaryItem } from '../objects/dictionaryItem.interface';
import { Dictionary } from '../objects/dictionary';
import { BaseDictionaryItem } from '../objects/baseDictionaryItem';
import { Injector } from '@angular/core';
import { RequestMethod } from './requestMethod.enum';
import { HttpHeaders } from '@angular/common/http';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';

type OBJECT_TYPE = DictionaryItem;
type RETURN_TYPE = Dictionary;

/**
 * The Endpoint implementation for a dictionary endpoint
 */
export class GetDictionary extends CacheableEndpoint<RETURN_TYPE, GetDictionaryItemsParams, OBJECT_TYPE> {
  public mockObjectsCreatorFunc: (injector: Injector) => Promise<Array<Record<string, unknown>>>;
  protected mockItemsCount = 20;
  protected mockObjects: Array<Record<string, unknown>>;

  /**
   * @param type An identifier for the dictionary (normally an enum value)
   * @param isLive Whether to use callLive or callMock method
   */
  constructor(public readonly type: unknown, isLive?: boolean, private isAuthenticated = false) {
    super(isLive);
  }

  /**
   * @param count Number of mock items to make
   * @returns A reference to this object
   */
  public setMockItemGenerationCount(count: number): this {
    this.mockItemsCount = count;
    return this;
  }
  /**
   * Set mock objects as they would be returned from a faked API call
   *
   * @param objects Objects to return from a mock api call
   * @returns A reference to this object
   */
  public setMockObjects(objects: Array<Record<string, unknown>>): this {
    this.mockObjects = objects;
    return this;
  }

  /**
   * @param func A function that will create mock objects.  This function gets the Injector passed in,
   * so if you get an HttpClient from there you can call out for mock data files in your assets, for instance.
   * @returns A reference to this object
   */
  public setMockObjectsCreatorFunc(func: (injector: Injector) => Promise<Array<Record<string, unknown>>>): this {
    this.mockObjectsCreatorFunc = func;
    return this;
  }

  /**
   * @param params params object
   * @returns The key that will reference this response in the cache.
   */
  protected getCacheKey(params: GetDictionaryItemsParams): string {
    return params.path;
  }
  /**
   * Calls out for live api dictionary data
   *
   * @param params parameters required to make the call
   * @returns A Promise of the raw data
   */
  protected callLive(params: GetDictionaryItemsParams): Promise<RETURN_TYPE> {
    const activeUser = localStorage.getItem('activeUser')
      ? (JSON.parse(localStorage.getItem('activeUser')) as LoginRegisterResponseDataSource)
      : null;

    let callResponsePromise;
    if (this.isAuthenticated && activeUser) {
      const headers = (): HttpHeaders => {
        let authHeader = new HttpHeaders();
        authHeader = authHeader.append('X-Session-Token', activeUser.sessionToken);
        return authHeader;
      };
      callResponsePromise = this.apiCaller.doCall(params.path, RequestMethod.GET, null, {}, headers);
    } else {
      callResponsePromise = this.apiCaller.doCall(params.path, RequestMethod.GET);
    }

    return this.buildObjectsFromResponse(params.typeObj, callResponsePromise).then(
      (items: Array<OBJECT_TYPE>) => new Dictionary(this.type, items as unknown as Array<OBJECT_TYPE>),
    );
  }

  /**
   * @param params parameters required to make the call
   * @returns Mock data items set using setMockObjects or produced using the function
   * passed to setMockObjectsCreatorFunc.
   */
  protected callMock(params: GetDictionaryItemsParams): Promise<RETURN_TYPE> {
    return this.buildObjectsFromResponse(
      params.typeObj,
      null == this.mockObjectsCreatorFunc
        ? Promise.resolve(null != this.mockObjects ? this.mockObjects.slice() : [])
        : this.mockObjectsCreatorFunc(this.injector),
    ).then((items: Array<OBJECT_TYPE>) => new Dictionary(this.type, items as unknown as Array<OBJECT_TYPE>));
  }
}

export interface GetDictionaryItemsParams {
  path: string;
  typeObj: typeof BaseDictionaryItem;
}
