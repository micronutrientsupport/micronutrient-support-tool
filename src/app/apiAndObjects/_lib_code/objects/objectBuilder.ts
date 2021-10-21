import { BaseObject } from './baseObject';
import { BaseApi } from '../api/baseApi.abstract';
import { Dictionary } from './dictionary';
import { BehaviorSubject } from 'rxjs';
import { BaseObjectRequiresDictionaries } from './baseObjectRequiresDictionaries';

/**
 * Should probably be called a "factory" rather than a "builder", as it fits that design pattern better.
 *
 * A singleton that calls the factory method for a supplied class and injects any required dictionaries
 * that are required, in order to return fully formed objects that are extended from
 * BaseObject or BaseObjectRequiresDictionaries.
 */
export class ObjectBuilder {
  private static instanceSource = new BehaviorSubject<ObjectBuilder>(null);

  private constructor(private apiService: BaseApi) {}

  public static setApi(apiService: BaseApi): void {
    const builder = new ObjectBuilder(apiService);
    this.instanceSource.next(builder);
  }

  /**
   * Returns the ObjectBuilder singleton once it has been fully populated with a reference
   * to a BaseApi (in order to retrieve Dictionaries)
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

  /**
   * Convenience method that calls the factory method on a BaseObject and returns the result.
   *
   * @param typeObject The class of the object (extended from BaseObject) that is to be built
   * @param data The raw data item that will be used to populate the object
   * @returns A Promise of an object that will be created from the typeObject class
   */
  public build<T>(typeObject: typeof BaseObject, data: Record<string, unknown>): Promise<T> {
    // console.debug('build', typeObject, data);
    const requiredDictTypes = (typeObject as typeof BaseObjectRequiresDictionaries).requiredDictionaryTypes;

    return null == requiredDictTypes
      ? Promise.resolve(typeObject.constructObject(data) as unknown as T)
      : this.apiService
          .getDictionaries(requiredDictTypes)
          .then(
            (dicts: Array<Dictionary>) =>
              (typeObject as typeof BaseObjectRequiresDictionaries).constructObject(data, dicts) as unknown as T,
          );
  }

  /**
   * Same as the build method but works with multiple objects and returns an Array
   */
  public buildArray<T>(typeObject: typeof BaseObject, data: Array<Record<string, unknown>>): Promise<Array<T>> {
    const objects = Array.isArray(data) ? data : [data];
    // console.debug('ObjectBuilder buildArray', objects);
    return Promise.all(objects.map((object: Record<string, unknown>) => this.build<T>(typeObject, object))).then(
      (items: Array<T>) => items.filter((item: T) => null != item),
    );
  }
}
