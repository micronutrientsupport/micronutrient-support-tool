import { CacheableEndpoint } from './cacheableEndpoint.abstract';
import { DictionaryItem } from '../objects/dictionaryItem.interface';
import { Dictionary } from '../objects/dictionary';
import { RequestMethod } from './apiCaller';
import { BaseDictionaryItem } from '../objects/baseDictionaryItem';

export class GetDictionary<DICTIONARY_TYPE_ENUM = any>
  extends CacheableEndpoint<Dictionary<DICTIONARY_TYPE_ENUM>, GetDictionaryItemsParams, DictionaryItem> {

  protected mockItemsCount = 20;
  protected mockObjects: Array<object>;

  constructor(
    public readonly type: DICTIONARY_TYPE_ENUM,
    isLive?: boolean
  ) {
    super(isLive);
  }

  protected getCacheKey(params: GetDictionaryItemsParams): string {
    return params.path;
  }

  protected callLive(params: GetDictionaryItemsParams): Promise<Dictionary<DICTIONARY_TYPE_ENUM>> {
    const callResponsePromise = this.apiCaller.doCall(params.path, RequestMethod.GET);

    return this.buildObjectsFromResponse(
      params.typeObj,
      callResponsePromise,
    ).then((items: Array<DictionaryItem>) => {
      return new Dictionary<DICTIONARY_TYPE_ENUM>(this.type, items);
    });

  }

  protected callMock(params: GetDictionaryItemsParams): Promise<Dictionary<DICTIONARY_TYPE_ENUM>> {
    let srcObjects: Array<object>;
    if (null != this.mockObjects) {
      srcObjects = this.mockObjects;
    } else {
      const template = `{
        "${BaseDictionaryItem.ID_ATTRIBUTE}": "<<id>>",
        "${BaseDictionaryItem.NAME_ATTRIBUTE}": "${params.path} Name <<id>>",
        "${BaseDictionaryItem.DESC_ATTRIBUTE}": "${params.path} Description <<id>>"
      }`;
      srcObjects = new Array<object>();
      for (let i = 0; i < this.mockItemsCount; i++) {
        srcObjects.push(JSON.parse(template.replace(/<<id>>/g, `${i}`)));
      }
    }
    return this.buildObjectsFromResponse(
      params.typeObj,
      Promise.resolve(srcObjects),
    ).then((items: Array<DictionaryItem>) => {
      return new Dictionary(this.type, items);
    });
  }

  public setMockItemGenerationCount(count: number): this {
    this.mockItemsCount = count;
    return this;
  }

  /**
   * Set mock objects as they would be returned from a faked API call
   */
  public setMockObjects(objects: Array<object>): this {
    this.mockObjects = objects;
    return this;
  }

}

export interface GetDictionaryItemsParams {
  path: string;
  typeObj: typeof BaseDictionaryItem;
}
