
import { BaseObject } from './baseObject';
import { BaseApi } from '../api/baseApi.abstract';
import { Dictionary } from './dictionary';
import { BehaviorSubject } from 'rxjs';
import { BaseObjectRequiresDictionaries } from './baseObjectRequiresDictionaries';

export class ObjectBuilder {
  private static instanceSource = new BehaviorSubject<ObjectBuilder>(null);

  private constructor(private apiService: BaseApi) { }

  public static setApi(apiService: BaseApi): void {
    const builder = new ObjectBuilder(apiService);
    this.instanceSource.next(builder);
  }

  /**
   * This is a singleton
   */
  public static get instance(): Promise<ObjectBuilder> {
    const currentInstance = ObjectBuilder.instanceSource.getValue();
    return null != currentInstance
      ? Promise.resolve(currentInstance)
      : new Promise<ObjectBuilder>((resolve) => {
        const subs = this.instanceSource.subscribe((builder: ObjectBuilder) => {
          if (null != builder) {
            if (null != subs) {
              subs.unsubscribe();
            }
            resolve(builder);
          }
        });
      });
  }

  public build<T>(typeObject: typeof BaseObject, data: Record<string, unknown>): Promise<T> {
    // console.debug('build', typeObject, data);
    const requiredDictTypes = (typeObject as typeof BaseObjectRequiresDictionaries).requiredDictionaryTypes;

    return (null == requiredDictTypes)
      ? Promise.resolve((typeObject.constructObject(data) as unknown) as T)
      : this.apiService.getDictionaries(requiredDictTypes)
        .then((dicts: Array<Dictionary>) => {
          // console.debug('got dicts', requiredDictTypes, dicts);
          return ((typeObject as typeof BaseObjectRequiresDictionaries).constructObject(data, dicts) as unknown) as T;
        });

  }

  public buildArray<T>(typeObject: typeof BaseObject, data: Array<Record<string, unknown>>): Promise<Array<T>> {
    const objects = Array.isArray(data) ? data : [data];
    // console.debug('ObjectBuilder buildArray', objects);
    return Promise.all(
      objects.map((object: Record<string, unknown>) => this.build<T>(typeObject, object)),
    ).then((items: Array<T>) => items.filter((item: T) => null != item));
  }
}
