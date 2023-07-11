import { ApiCaller } from './apiCaller';
import { HttpClient } from '@angular/common/http';
import { ObjectBuilder } from '../objects/objectBuilder';
import { GetDictionary } from './getDictionary';
import { Endpoint } from './endpoint.abstract';
import { Dictionary } from '../objects/dictionary';
import { Injector } from '@angular/core';
import { MapsHttpResponseHandler } from '../../api/mapsHttpResponseHandler';

/**
 * Extend this class to create your API service.
 */
export abstract class BaseApi {
  protected apiCaller: ApiCaller;

  protected endPointsArray = new Array<Endpoint>();

  protected dictionaries = new Map<unknown, GetDictionary>();

  /**
   * @param injector The angular injector.  Passing this in allows it to be available to all Endpoint objects
   * @param httpClient Explicitely passed in (rather than just obtained from injector) as it's vaital that it's available
   * @param httpCallErrorHandler A HttpResponseHandler object
   * @param apiBaseUrl A url that will be prepended to Endpoint urls
   */
  constructor(
    protected injector: Injector,
    httpClient: HttpClient,
    httpCallErrorHandler: MapsHttpResponseHandler,
    apiBaseUrl: string,
  ) {
    this.apiCaller = new ApiCaller(httpClient, httpCallErrorHandler, apiBaseUrl);

    ObjectBuilder.setApi(this);
  }

  /**
   * @param type Normally an enumerator value that is used to identifies a specific GetDictionary instance
   * @returns The matching GetDictionary instance
   */
  public getDictionaryEndpoint(type: unknown): GetDictionary {
    return this.dictionaries.get(type);
  }

  /**
   * @param type Normally an Array of enumerator values that are used to identify specific GetDictionary instances
   * @returns An Array of matching GetDictionary instances
   */
  public getDictionaryEndpoints(types: Array<unknown>): Array<GetDictionary> {
    return types.map((type: unknown) => this.dictionaries.get(type));
  }

  /**
   * @param type Normally an enumerator value that is used to identifies a specific GetDictionary instance
   * @param useCache Whether to cache the dictionary or not (defaults to true)
   * @returns A Promise for the matching Dictionary object
   */
  public getDictionary(type: unknown, useCache?: boolean): Promise<Dictionary> {
    const endpoint = this.getDictionaryEndpoint(type);
    return null == endpoint ? Promise.reject() : endpoint.call(null, useCache);
  }
  /**
   * @param type Normally an Array of enumerator values that are used to identify specific GetDictionary instances
   * @param useCache Whether to cache the dictionary or not (defaults to true)
   * @returns A Promise for the Array of matching Dictionary objects
   */
  public getDictionaries(types: Array<unknown>, useCache?: boolean): Promise<Array<Dictionary>> {
    const endpoints = this.getDictionaryEndpoints(types);
    return Promise.all(endpoints.map((endpoint: GetDictionary) => endpoint.call(null, useCache)));
  }
  /**
   * Adds a default header for when calling out with a registered Endpoint
   *
   * @param key header name
   * @param value header value
   * @returns This BaseApi instance
   */
  protected addDefaultHeader(key: string, value: string): this {
    this.apiCaller.addDefaultHeader(key, value);
    return this;
  }
  /**
   * Removes a default header for when calling out with a registered Endpoint
   *
   * @param key header name
   * @returns This BaseApi instance
   */
  protected removeDefaultHeader(key: string): this {
    this.apiCaller.removeDefaultHeader(key);
    return this;
  }
  /**
   * Registers and initialises an Endpoint
   *
   * @param endpoint The Endpoint instance to use
   * @returns This BaseApi instance
   */
  protected addEndpoint(endpoint: Endpoint<unknown, unknown>): this {
    this.endPointsArray.push(endpoint);
    endpoint.init(this.injector, this.apiCaller);
    return this;
  }
  /**
   * Registers and initialises an Array of Endpoints
   *
   * @param endpoints The Endpoint instances to use
   * @returns This BaseApi instance
   */
  protected addEndpoints(endpoints: Array<Endpoint<unknown, unknown>>): this {
    endpoints.forEach((endpoint: Endpoint<unknown, unknown>) => {
      this.addEndpoint(endpoint);
    });
    return this;
  }
  /**
   * Registers and initialises a GetDictionary Endpoint
   *
   * @param endpoint The GetDictionary Endpoint instance to use
   * @returns This BaseApi instance
   */
  protected addDictionary(endpoint: GetDictionary): this {
    endpoint.init(this.injector, this.apiCaller);
    this.dictionaries.set(endpoint.type, endpoint);
    return this;
  }
  /**
   * Registers and initialises an Array of GetDictionary Endpoints
   *
   * @param endpoints The GetDictionary Endpoint instances to use
   * @returns This BaseApi instance
   */
  protected addDictionaries(endpoints: Array<GetDictionary>): this {
    endpoints.forEach((endpoint: GetDictionary) => {
      this.addDictionary(endpoint);
    });
    return this;
  }
}
