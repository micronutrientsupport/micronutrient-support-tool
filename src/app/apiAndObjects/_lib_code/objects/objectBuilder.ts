import { RequiresDictionaries } from './requiresDictionaries.interface';
import { BaseObject } from './baseObject';
import { BaseApi } from '../api/baseApi.abstract';
import { Dictionary } from './dictionary';
import { BehaviorSubject } from 'rxjs';

export class ObjectBuilder {

  private static _instanceSource = new BehaviorSubject<ObjectBuilder>(null);

  public static setApi(apiService: BaseApi): void {
    const builder = new ObjectBuilder(apiService);
    this._instanceSource.next(builder);
  }

  /**
   * This is a singleton
   */
  public static get instance(): Promise<ObjectBuilder> {
    const currentInstance = ObjectBuilder._instanceSource.getValue();
    return (null != currentInstance)
      ? Promise.resolve(currentInstance)
      : new Promise<ObjectBuilder>((resolve) => {
        const subs = this._instanceSource.subscribe((builder: ObjectBuilder) => {
          if (null != builder) {
            if (null != subs) {
              subs.unsubscribe();
            }
            resolve(builder);
          }
        });
      });
  }

  private constructor(
    private apiService: BaseApi,
  ) {
  }

  public build<T>(typeObject: typeof BaseObject, data: object): Promise<T> {
    const item = typeObject.makeItemFromObject(data) as unknown as T;
    // if (null == item) {
    //   console.debug('ObjectBuilder build', typeObject.name, item, data);
    // }
    return new Promise((resolve) => {
      // tslint:disable-next-line: no-string-literal
      if (null == item['_requiredDictionaryList']) {
        resolve(item);
      } else {
        const reqDictionaryItem = item as unknown as RequiresDictionaries;
        resolve(
          this.apiService.getDictionaries(reqDictionaryItem._requiredDictionaryList)
            .then((dicts: Array<Dictionary>) => {
              // console.debug('ObjectBuilder getDictionaries');
              reqDictionaryItem.setDictionaries(dicts);
              return item;
            })
        );
      }
    })
      .then(() => {
        // tslint:disable-next-line: no-string-literal
        return (typeof item['init'] === 'function')
          // tslint:disable-next-line: no-string-literal
          ? item['init']()
          : item;
      });

  }

  public buildArray<T>(typeObject: typeof BaseObject, data: Array<object>): Promise<Array<T>> {
    const objects = (Array.isArray(data)) ? data : [data];
    // console.debug('ObjectBuilder buildArray', objects);
    return Promise.all(objects
      .map((object: object) => {
        return this.build<T>(typeObject, object);
      })
    ).then((items: Array<T>) => items.filter((item: T) => (null != item)));
  }

}
