import { RequiresDictionaries } from './requiresDictionaries.interface';
import { BaseObject } from './baseObject';
import { BaseApi } from '../api/baseApi.abstract';
import { Dictionary } from './dictionary';
import { BehaviorSubject } from 'rxjs';

export class ObjectBuilder {
  private static instanceSource = new BehaviorSubject<ObjectBuilder>(null);

  private constructor(private apiService: BaseApi) {}

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
    const item = (typeObject.makeItemFromObject(data) as unknown) as T;
    // if (null == item) {
    //   console.debug('ObjectBuilder build', typeObject.name, item, data);
    // }
    return new Promise((resolve) => {
      const reqDictionaryItem = (item as unknown) as RequiresDictionaries;
      if (null == reqDictionaryItem.requiredDictionaryList) {
        resolve(item);
      } else {
        resolve(
          this.apiService.getDictionaries(reqDictionaryItem.requiredDictionaryList).then((dicts: Array<Dictionary>) => {
            // console.debug('ObjectBuilder getDictionaries');
            reqDictionaryItem.setDictionaries(dicts);
            return item;
          }),
        );
      }
    }).then(
      (thisItem: BaseObject) => (('function' === typeof thisItem.init ? thisItem.init() : thisItem) as unknown) as T,
    );
  }

  public buildArray<T>(typeObject: typeof BaseObject, data: Array<Record<string, unknown>>): Promise<Array<T>> {
    const objects = Array.isArray(data) ? data : [data];
    // console.debug('ObjectBuilder buildArray', objects);
    return Promise.all(
      objects.map((object: Record<string, unknown>) => this.build<T>(typeObject, object)),
    ).then((items: Array<T>) => items.filter((item: T) => null != item));
  }
}
