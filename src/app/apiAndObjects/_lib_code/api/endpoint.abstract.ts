import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiCaller } from './apiCaller';
import { ObjectBuilder } from '../objects/objectBuilder';
import { BaseObject } from '../objects/baseObject';
import { ApiResponse } from './apiResponse.interface';
import { Injector } from '@angular/core';

export abstract class Endpoint<RETURN_TYPE = any, PARAMS_TYPE = any, OBJECT_TYPE = RETURN_TYPE> {
  private initialised = new BehaviorSubject<boolean>(false);

  protected onSuccessFuncs = new Array<(data: RETURN_TYPE) => void>();
  protected onFailFuncs = new Array<(error: any) => void>();
  protected onCompleteFuncs = new Array<() => void>();

  protected injector: Injector;
  protected apiCaller: ApiCaller;
  protected defaultParams: PARAMS_TYPE;

  constructor(
    protected isLive = true,
  ) { }

  protected abstract callLive(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;
  protected abstract callMock(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;

  // TODO: can we stop two simultanious calls identical calls here using simpler
  // caching thab in the cacheable endpoint?:
  public call(params?: PARAMS_TYPE): Promise<RETURN_TYPE> {
    // console.debug('call', this, params, this.defaultParams, this.mergeParams(params));
    return new Promise((resolve) => {
      const resolveFunc = () => {
        const mergedParams = this.mergeParams(params);

        return ((this.isLive)
          ? this.callLive(mergedParams)
          : this.callMock(mergedParams)
        )
          .then((data: RETURN_TYPE) => {
            this.onSuccessFuncs.forEach(func => func(data));
            return data;
          })
          .catch((error) => {
            this.onFailFuncs.forEach(func => func(error));
            throw (error);
          })
          .finally(() => {
            this.onCompleteFuncs.forEach(func => func());
          });
      };

      if (this.initialised.value) {
        resolve(resolveFunc());
      } else {
        let subs: Subscription;
        subs = this.initialised.subscribe(() => {
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

  protected mergeParams(params: PARAMS_TYPE): PARAMS_TYPE {
    const overrideParams = (null == params) ? {} : params;
    const defaultParams = (null == this.defaultParams) ? {} : this.defaultParams;

    // merge them
    return {
      ...defaultParams,
      ...overrideParams,
    } as PARAMS_TYPE;
  }

  public setDefaultParams(params: PARAMS_TYPE): this {
    this.defaultParams = params;
    return this;
  }

  public setLive(isLive: boolean): this {
    this.isLive = isLive;
    return this;
  }

  public init(
    injector: Injector,
    apiCaller: ApiCaller,
  ): void {
    this.injector = injector;
    this.apiCaller = apiCaller;
    this.initialised.next(true);
    // console.debug('endpoint init', this);
  }

  protected   buildObjectsFromResponse(
    object: typeof BaseObject,
    responseProm: Promise<ApiResponse>,
  ): Promise<Array<OBJECT_TYPE>> {
    return responseProm
      .then((response: ApiResponse) => {
        // console.debug('buildObjectsFromResponse', responses);
        let data = response.data;
        // if not an array convert to an array
        data = (Array.isArray(data)) ? data : [data];
        return ObjectBuilder.instance.then((builder: ObjectBuilder) => {
          return builder.buildArray<OBJECT_TYPE>(object, data);
        });
      });
  }

  protected buildObjectFromResponse(
    object: typeof BaseObject,
    responseProm: Promise<ApiResponse>,
  ): Promise<OBJECT_TYPE> {
    return this.buildObjectsFromResponse(object, responseProm)
      .then((objectArray: Array<OBJECT_TYPE>) => objectArray[0]); // just the one result
  }

  protected createBodyFormData(bodyData: object): FormData {
    // console.debug('createBodyFormData', bodyData);
    const formData = new FormData();
    Object.keys(bodyData).forEach((key: string) => {
      // if it's an array of files append differently
      // TODO: check if this was just the way it was for the submission endpoint in eurovolc.
      // Maybe this should happen for all arrays, not just files
      if (Array.isArray(bodyData[key]) && (bodyData[key][0] instanceof File)) {
        bodyData[key].forEach((element: any) => {
          formData.append(key, element);
        });
      } else {
        formData.append(key, bodyData[key]);
      }
    });
    return formData;
  }

  protected removeNullsFromObject(object: object): {} {
    const returnObj = {};
    if (null != object) {
      Object.keys(object).forEach((key: string) => {
        if (null != object[key]) {
          returnObj[key] = object[key];
        }
      });
    }
    return returnObj;
  }

  protected createMockResponseObject(dataIn: any, success = true): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve({
            data: dataIn,
          } as ApiResponse);
        } else {
          reject('Mock API Error');
        }
      }, 500);
    });
  }

  // created to change form of variables to those accepted by api implementation
  // not currently used
  // protected processObject(
  //   object: object,
  //   includeFilter?: string | Array<string>,
  //   excludeFilter?: string | Array<string>,
  //   dontTouchFilter?: string | Array<string>
  // ): object {
  //   includeFilter =
  //     typeof includeFilter === 'string' ? [includeFilter] : includeFilter;
  //   excludeFilter =
  //     typeof excludeFilter === 'string' ? [excludeFilter] : excludeFilter;
  //   const data = {};
  //   if (null != object) {
  //     Object.keys(object).forEach((key: string) => {
  //       const value = object[key];
  //       if (dontTouchFilter && dontTouchFilter.includes(key)) {
  //         data[key] = value; // take val as-is and dont tinker
  //         return;
  //       }
  //       // filter not populated
  //       if (
  //         (!includeFilter || includeFilter.indexOf(key) > -1) && // included
  //         (!excludeFilter || excludeFilter.indexOf(key) === -1) // not excluded
  //       ) {
  //         switch (true) {
  //           case (typeof value === 'boolean'):
  //             data[key] = value;
  //             break;
  //           case (!value):
  //             break; // if empty
  //           case (Array.isArray(value)):
  //             if (value.length > 0) {
  //               data[key] = value;
  //             }
  //             break;
  //           // case (moment.isMoment(value)):
  //           //   data[key] = (value as moment.Moment).toISOString();
  //           //   break;
  //           case (value instanceof Date):
  //             data[key] = value.toISOString();
  //             break;
  //           default:
  //             data[key] = value;
  //             break;
  //         }
  //       }
  //     });
  //   }
  //   // console.log('criteriaMapToObject',  data, criteriaMap);
  //   return data;
  // }

}
