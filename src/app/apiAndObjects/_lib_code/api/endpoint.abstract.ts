import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiCaller } from './apiCaller';
import { ObjectBuilder } from '../objects/objectBuilder';
import { BaseObject } from '../objects/baseObject';
import { Injector } from '@angular/core';

export abstract class Endpoint<RETURN_TYPE = any, PARAMS_TYPE = any, OBJECT_TYPE = RETURN_TYPE> {
  protected onSuccessFuncs = new Array<(data: RETURN_TYPE) => void>();
  protected onFailFuncs = new Array<(error: any) => void>();
  protected onCompleteFuncs = new Array<() => void>();

  protected injector: Injector;
  protected apiCaller: ApiCaller;
  protected defaultParams: PARAMS_TYPE;

  private initialised = new BehaviorSubject<boolean>(false);

  constructor(protected isLive = true) {}

  // TODO: can we stop two simultanious calls identical calls here using simpler
  // caching thab in the cacheable endpoint?:
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
   * call to run code on external call success etc (called from promise.then)
   */
  public onSuccess(onSuccess: (data: RETURN_TYPE) => void): this {
    if (null != onSuccess) {
      this.onSuccessFuncs.push(onSuccess);
    }
    return this;
  }
  /**
   * call to run code on external call failure (called from promise.catch)
   */
  public onFail(onError: (error: any) => void): this {
    if (null != onError) {
      this.onFailFuncs.push(onError);
    }
    return this;
  }
  /**
   * call to run code after external call (called from promise.finally)
   */
  public onComplete(onComplete: () => void): this {
    if (null != onComplete) {
      this.onCompleteFuncs.push(onComplete);
    }
    return this;
  }

  public setDefaultParams(params: PARAMS_TYPE): this {
    this.defaultParams = params;
    return this;
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

  protected buildObjectsFromResponse(object: typeof BaseObject, dataProm: Promise<any>): Promise<Array<OBJECT_TYPE>> {
    return dataProm.then((data: any) => {
      // console.debug('buildObjectsFromResponse', data);
      // if not an array convert to an array
      data = Array.isArray(data) ? data : [data];
      return ObjectBuilder.instance.then((builder: ObjectBuilder) => builder.buildArray<OBJECT_TYPE>(object, data));
    });
  }

  protected buildObjectFromResponse(object: typeof BaseObject, dataProm: Promise<any>): Promise<OBJECT_TYPE> {
    return this.buildObjectsFromResponse(object, dataProm).then((objectArray: Array<OBJECT_TYPE>) => objectArray[0]); // just the one result
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected createBodyFormData(bodyData: object): FormData {
    // console.debug('createBodyFormData', bodyData);
    const formData = new FormData();
    Object.keys(bodyData).forEach((key: string) => {
      // if it's an array of files append differently
      // TODO: check if this was just the way it was for the submission endpoint in eurovolc.
      // Maybe this should happen for all arrays, not just files
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Array.isArray(bodyData[key]) && bodyData[key][0] instanceof File) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        bodyData[key].forEach((element: any) => {
          formData.append(key, element);
        });
      } else {
        formData.append(key, bodyData[key]);
      }
    });
    return formData;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected removeNullsFromObject(object: object): {} {
    const returnObj = {};
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
