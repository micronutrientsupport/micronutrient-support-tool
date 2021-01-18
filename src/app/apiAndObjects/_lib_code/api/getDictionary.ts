/* eslint-disable @typescript-eslint/ban-types */
import { CacheableEndpoint } from './cacheableEndpoint.abstract';
import { DictionaryItem } from '../objects/dictionaryItem.interface';
import { Dictionary } from '../objects/dictionary';
import { RequestMethod } from './apiCaller';
import { BaseDictionaryItem } from '../objects/baseDictionaryItem';
import { Injector } from '@angular/core';

export class GetDictionary<DICTIONARY_TYPE_ENUM = any>
  extends CacheableEndpoint<Dictionary<DICTIONARY_TYPE_ENUM>, GetDictionaryItemsParams, DictionaryItem> {

  public mockObjectsCreatorFunc: (injector: Injector) => Promise<Array<Record<string, unknown>>>;
  protected mockItemsCount = 20;
  protected mockObjects: Array<Record<string, unknown>>;

  constructor(public readonly type: DICTIONARY_TYPE_ENUM, isLive?: boolean) {
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

  protected callLive(params: GetDictionaryItemsParams): Promise<Dictionary<DICTIONARY_TYPE_ENUM>> {
    const callResponsePromise = this.apiCaller.doCall(params.path, RequestMethod.GET);

    return this.buildObjectsFromResponse(params.typeObj, callResponsePromise).then(
      (items: Array<DictionaryItem>) =>
        new Dictionary<DICTIONARY_TYPE_ENUM>(this.type, (items as unknown) as Array<DictionaryItem>),
    );
  }

  protected callMock(params: GetDictionaryItemsParams): Promise<Dictionary<DICTIONARY_TYPE_ENUM>> {
    return this.buildObjectsFromResponse(
      params.typeObj,
      ((null == this.mockObjectsCreatorFunc)
        ? Promise.resolve((null != this.mockObjects) ? this.mockObjects.slice() : [])
        : this.mockObjectsCreatorFunc(this.injector))
    ).then(
      (items: Array<DictionaryItem>) => new Dictionary(this.type, (items as unknown) as Array<DictionaryItem>),
    );
  }
}

export interface GetDictionaryItemsParams {
  path: string;
  typeObj: typeof BaseDictionaryItem;
}
