/* eslint-disable @typescript-eslint/ban-types */
import { CacheableEndpoint } from './cacheableEndpoint.abstract';
import { DictionaryItem } from '../objects/dictionaryItem.interface';
import { Dictionary } from '../objects/dictionary';
import { BaseDictionaryItem } from '../objects/baseDictionaryItem';
import { Injector } from '@angular/core';
import { RequestMethod } from './requestMethod.enum';

type OBJECT_TYPE = DictionaryItem;
type RETURN_TYPE = Dictionary;

export class GetDictionary
  extends CacheableEndpoint<RETURN_TYPE, GetDictionaryItemsParams, OBJECT_TYPE> {

  public mockObjectsCreatorFunc: (injector: Injector) => Promise<Array<Record<string, unknown>>>;
  protected mockItemsCount = 20;
  protected mockObjects: Array<Record<string, unknown>>;


  constructor(public readonly type: any, isLive?: boolean) {
    super(isLive);
  }

  public setMockItemGenerationCount(count: number): this {
    this.mockItemsCount = count;
    return this;
  }
  /**
   * Set mock objects as they would be returned from a faked API call
   */
  public setMockObjects(objects: Array<Record<string, unknown>>): this {
    this.mockObjects = objects;
    return this;
  }

  public setMockObjectsCreatorFunc(func: (injector: Injector) => Promise<Array<Record<string, unknown>>>): this {
    this.mockObjectsCreatorFunc = func;
    return this;
  }

  protected getCacheKey(params: GetDictionaryItemsParams): string {
    return params.path;
  }

  protected callLive(params: GetDictionaryItemsParams): Promise<RETURN_TYPE> {
    const callResponsePromise = this.apiCaller.doCall(params.path, RequestMethod.GET);

    return this.buildObjectsFromResponse(params.typeObj, callResponsePromise).then(
      (items: Array<OBJECT_TYPE>) =>
        new Dictionary(this.type, (items as unknown) as Array<OBJECT_TYPE>),
    );
  }

  protected callMock(params: GetDictionaryItemsParams): Promise<RETURN_TYPE> {
    return this.buildObjectsFromResponse(
      params.typeObj,
      ((null == this.mockObjectsCreatorFunc)
        ? Promise.resolve((null != this.mockObjects) ? this.mockObjects.slice() : [])
        : this.mockObjectsCreatorFunc(this.injector))
    ).then(
      (items: Array<OBJECT_TYPE>) => new Dictionary(this.type, (items as unknown) as Array<OBJECT_TYPE>),
    );
  }
}

export interface GetDictionaryItemsParams {
  path: string;
  typeObj: typeof BaseDictionaryItem;
}
