import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiCaller } from './apiCaller';
import { ObjectBuilder } from '../objects/objectBuilder';
import { BaseObject } from '../objects/baseObject';
import { Injector } from '@angular/core';

export abstract class Endpoint<RETURN_TYPE = unknown, PARAMS_TYPE = unknown, OBJECT_TYPE = RETURN_TYPE> {
  protected onSuccessFuncs = new Array<(data: RETURN_TYPE) => void>();
  protected onFailFuncs = new Array<(error: unknown) => void>();
  protected onCompleteFuncs = new Array<() => void>();

  protected injector: Injector;
  protected apiCaller: ApiCaller;
  protected defaultParams: PARAMS_TYPE;

  private initialised = new BehaviorSubject<boolean>(false);

  constructor(protected isLive = true) { }

  // TODO: can we stop two simultanious, identical calls here using simpler
  // caching than in the cacheable endpoint?:
  public call(params?: PARAMS_TYPE): Promise<RETURN_TYPE> {
    // console.debug('call', this, params, this.defaultParams, this.mergeParams(params));
    return new Promise((resolve) => {
      const resolveFunc = () => {
        const mergedParams = this.mergeParams(params);

        return (this.isLive ? this.callLive(mergedParams) : this.callMock(mergedParams))
          .then((data: RETURN_TYPE) => {
            this.onSuccessFuncs.forEach((func) => func(data));
            return data;
          })
          .catch((error) => {
            this.onFailFuncs.forEach((func) => func(error));
            throw error;
          })
          .finally(() => {
            this.onCompleteFuncs.forEach((func) => func());
          });
      };

      if (this.initialised.value) {
        resolve(resolveFunc());
      } else {
        const subs: Subscription = this.initialised.subscribe(() => {
          if (null != subs) {
            subs.unsubscribe();
          }
          resolve(resolveFunc());
        });
      }
    });
  }

  /**
   * adds a function that will be called from the promise.then block of the api http call.
   */
  public addOnSuccessFunc(onSuccess: (data: RETURN_TYPE) => void): this {
    if (null != onSuccess) {
      this.onSuccessFuncs.push(onSuccess);
    }
    return this;
  }
  /**
   * adds a function that will be called from the promise.catch block of the api http call.
   */
  public addOnFailFunc(onError: (error: unknown) => void): this {
    if (null != onError) {
      this.onFailFuncs.push(onError);
    }
    return this;
  }
  /**
   * adds a function that will be called from the promise.finally block of the api http call.
   */
  public addOnCompleteFunc(onComplete: () => void): this {
    if (null != onComplete) {
      this.onCompleteFuncs.push(onComplete);
    }
    return this;
  }

  public setDefaultParams(params: PARAMS_TYPE): this {
    this.defaultParams = params;
    return this;
  }

  public get getIsLive(): boolean {
    return this.isLive;
  }

  public setLive(isLive: boolean): this {
    this.isLive = isLive;
    return this;
  }

  public init(injector: Injector, apiCaller: ApiCaller): void {
    this.injector = injector;
    this.apiCaller = apiCaller;
    this.initialised.next(true);
    // console.debug('endpoint init', this);
  }

  protected mergeParams(params: PARAMS_TYPE): PARAMS_TYPE {
    const overrideParams = null == params ? {} : params;
    const defaultParams = null == this.defaultParams ? {} : this.defaultParams;

    // merge them
    return {
      ...defaultParams,
      ...overrideParams,
    } as PARAMS_TYPE;
  }

  protected buildObjectsFromResponse(object: typeof BaseObject, dataProm: Promise<unknown>): Promise<Array<OBJECT_TYPE>> {
    return dataProm.then((data: Record<string, unknown> | Array<Record<string, unknown>>) => {
      // console.debug('buildObjectsFromResponse', data);
      // if not an array convert to an array
      const dataArray = Array.isArray(data) ? data : [data];
      return ObjectBuilder.instance.then((builder: ObjectBuilder) =>
        builder.buildArray<OBJECT_TYPE>(object, dataArray),
      );
    });
  }

  protected buildObjectFromResponse(object: typeof BaseObject, dataProm: Promise<unknown>): Promise<OBJECT_TYPE> {
    return this.buildObjectsFromResponse(object, dataProm).then((objectArray: Array<OBJECT_TYPE>) => objectArray[0]); // just the one result
  }

  protected createBodyFormData(bodyData: Record<string, unknown>): FormData {
    // console.debug('createBodyFormData', bodyData);
    const formData = new FormData();
    Object.keys(bodyData).forEach((key: string) => {
      this.createFormData(formData, bodyData[key], key);
    });
    return formData;
  }

  protected createFormData(formData: FormData, data: unknown, key: string): void {
    if ((typeof data === 'object' && data !== null) || Array.isArray(data)) {
      Object.keys(data).forEach((i: string) => {
        this.formDataAppend(formData, key, i, data[i]);
      });
    } else {
      formData.append(key, data as string);
    }
  }

  protected formDataAppend(
    formData: FormData,
    groupKey: string,
    itemKey: string,
    value: unknown | File
  ): void {
    if (null == value) {
      // do nothing
    } else if (value instanceof File) {
      // console.debug('adding file ', fileName, value);
      formData.append(
        groupKey + '[' + itemKey + ']',
        value as Blob,
        value.name
      ); // needs the i?
    } else if (
      (typeof value === 'object' && value !== null) ||
      Array.isArray(value)
    ) {
      this.createFormData(formData, value, groupKey + '[' + itemKey + ']');
    } else {
      formData.append(groupKey + '[' + itemKey + ']', value as string);
    }
  }

  protected removeNullsFromObject(object: Record<string, unknown>): Record<string, unknown> {
    const returnObj: Record<string, unknown> = {};
    if (null != object) {
      Object.keys(object).forEach((key: string) => {
        if (null != object[key]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          returnObj[key] = object[key];
        }
      });
    }
    return returnObj;
  }

  protected abstract callLive(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;
  protected abstract callMock(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;
}
