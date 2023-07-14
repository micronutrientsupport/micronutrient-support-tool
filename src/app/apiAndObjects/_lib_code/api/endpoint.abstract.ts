import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiCaller } from './apiCaller';
import { ObjectBuilder } from '../objects/objectBuilder';
import { BaseObject } from '../objects/baseObject';
import { Injector } from '@angular/core';
import { UserLoginService } from 'src/app/services/userLogin.service';
import { LoginRegisterResponseDataSource } from '../../objects/loginRegisterResponseDataSource';

export abstract class Endpoint<RETURN_TYPE = unknown, PARAMS_TYPE = unknown, OBJECT_TYPE = RETURN_TYPE> {
  protected onSuccessFuncs = new Array<(data: RETURN_TYPE) => void>();
  protected onFailFuncs = new Array<(error: unknown) => void>();
  protected onCompleteFuncs = new Array<() => void>();

  protected injector: Injector;
  protected apiCaller: ApiCaller;
  // TODO: should this use "Partial" functionality to allow only part of an object to be defined?
  protected defaultParams: PARAMS_TYPE;

  private initialised = new BehaviorSubject<boolean>(false);

  constructor(protected isLive = true, protected userLoginService?: UserLoginService) {}

  // TODO: can we stop two simultanious, identical calls here using simpler
  // caching than in the cacheable endpoint?:
  /**
   * Calls the Endpoint's callLive or callMock method, depending on [isLive]{@link #isLive}.
   * Also runs any onSuccess, onFail or onComplete functions that have been set before returning.
   *
   * @param params params used for call (merged with and overrides defaults)
   * @returns Promise of call data (once it's been initialised)
   */
  public call(params?: PARAMS_TYPE): Promise<RETURN_TYPE> {
    // console.debug('call', this, params, this.defaultParams, this.mergeParams(params));
    return new Promise((resolve) => {
      const resolveFunc = () => {
        const mergedParams = this.validateAndMergeParams(params);

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

  /**
   * Sets default params that can be overridden on individual calls
   *
   * @param params set of params to use as defaults
   * @returns This instance
   */
  public setDefaultParams(params: PARAMS_TYPE): this {
    this.defaultParams = params;
    return this;
  }

  /**
   * Getter for isLive
   */
  public get getIsLive(): boolean {
    return this.isLive;
  }

  /**
   * @param isLive whether to use callLive or callMock method
   * @returns This instance
   */
  public setLive(isLive: boolean): this {
    this.isLive = isLive;
    return this;
  }

  /**
   * Specific to MAPS project
   * @returns the active user's details.
   */
  public getActiveUser(): LoginRegisterResponseDataSource | null {
    return this.userLoginService.getActiveUser();
  }

  /**
   * Initialises object by passing in required references. Sets [initialised]{@link #initialised} value to true
   *
   * @param injector  The angular injector.  Passing this in allows it to be available to inheriting object
   * @param apiCaller  Passing this in allows it to be available to inheriting object
   */
  public init(injector: Injector, apiCaller: ApiCaller): void {
    this.injector = injector;
    this.apiCaller = apiCaller;
    this.initialised.next(true);
    // console.debug('endpoint init', this);
  }

  /**
   * merges passed in params with [defaultParams]{@link #defaultParams} before calling [validateParams]{@link #validateParams}
   *
   * @param params override params
   * @returns merged params
   */
  protected validateAndMergeParams(params: PARAMS_TYPE): PARAMS_TYPE {
    const defaultParams = (null == this.defaultParams ? {} : this.defaultParams) as PARAMS_TYPE;
    const overrideParams = (null == params ? {} : params) as PARAMS_TYPE;
    // merge them
    const mergedParams = {
      ...defaultParams,
      ...overrideParams,
    };

    this.validateParams(mergedParams, overrideParams, defaultParams);

    return mergedParams;
  }

  /**
   * Override and throw a new Error('my error') if params invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected validateParams(mergedParams: PARAMS_TYPE, overrideParams: PARAMS_TYPE, defaultParams: PARAMS_TYPE): void {}

  /**
   * Uses the ObjectBuilder singleton to build objects of a required type from a raw value
   *
   * @param object Class reference for the required Object (extended from BaseObject)
   * @param dataProm The Promise for the raw value
   * @returns An Array of built objects
   */
  protected buildObjectsFromResponse(
    object: typeof BaseObject,
    dataProm: Promise<unknown>,
  ): Promise<Array<OBJECT_TYPE>> {
    return dataProm.then((data: Record<string, unknown> | Array<Record<string, unknown>>) => {
      // console.debug('buildObjectsFromResponse', data);
      // if not an array convert to an array
      const dataArray = Array.isArray(data) ? data : [data];
      return ObjectBuilder.instance.then((builder: ObjectBuilder) =>
        builder.buildArray<OBJECT_TYPE>(object, dataArray),
      );
    });
  }
  /**
   * Convenience method that calls the [buildObjectsFromResponse]{@link #buildObjectsFromResponse}
   * method and returns the first built object
   *
   * @param object Class reference for the required Object (extended from BaseObject)
   * @param dataProm The Promise for the raw value
   * @returns A built object
   */
  protected buildObjectFromResponse(object: typeof BaseObject, dataProm: Promise<unknown>): Promise<OBJECT_TYPE> {
    return this.buildObjectsFromResponse(object, dataProm).then((objectArray: Array<OBJECT_TYPE>) => objectArray[0]); // just the one result
  }

  /**
   * Helper method to transform an object into FormData (what might be submitted from a standard html form)
   *
   * @param bodyData data object
   * @returns a corresponding FormData object
   */
  protected createBodyFormData(bodyData: Record<string, unknown>): FormData {
    // console.debug('createBodyFormData', bodyData);
    const formData = new FormData();
    Object.keys(bodyData).forEach((key: string) => {
      this.formDataAppend(formData, bodyData[key], key);
    });
    return formData;
  }
  /**
   * Appends data to a FormData object
   *
   * @param formData FormData object
   * @param data data to append
   * @param key key (name) to set the data to in the FormData
   */
  protected formDataAppend(formData: FormData, data: unknown, key: string): void {
    if ((typeof data === 'object' && data !== null) || Array.isArray(data)) {
      Object.keys(data).forEach((i: string) => {
        this.formDataGroupAppend(formData, key, i, data[i]);
      });
    } else {
      formData.append(key, data as string);
    }
  }

  /**
   * Appends complex data to a FormData object
   *
   * @param formData FormData object
   * @param groupKey group key (name) to set the data to in the FormData
   * @param itemKey item key (name) to set the data to in the FormData
   * @param value value to append
   */
  protected formDataGroupAppend(formData: FormData, groupKey: string, itemKey: string, value: unknown | File): void {
    if (null == value) {
      // do nothing
    } else if (value instanceof File) {
      // console.debug('adding file ', fileName, value);
      formData.append(groupKey + '[' + itemKey + ']', value as Blob, value.name); // needs the i?
    } else if ((typeof value === 'object' && value !== null) || Array.isArray(value)) {
      this.formDataAppend(formData, value, groupKey + '[' + itemKey + ']');
    } else {
      formData.append(groupKey + '[' + itemKey + ']', value as string);
    }
  }

  /**
   * Helper method that removes nullish values from an object
   *
   * @param object source data object
   * @returns a new object that doesn't include the nullish values from the source
   */
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
  /**
   * Live call method that needs to be implemented by inheriting class
   *
   * @param params parameters to configure the call with
   */
  protected abstract callLive(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;
  /**
   * Mock call method that needs to be implemented by inheriting class
   *
   * @param params parameters to configure the call with
   */
  protected abstract callMock(params?: PARAMS_TYPE): Promise<RETURN_TYPE>;
}
