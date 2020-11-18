import { ApiCaller } from './apiCaller';
import { HttpClient } from '@angular/common/http';
import { ObjectBuilder } from '../objects/objectBuilder';
import { GetDictionary } from './getDictionary';
import { Endpoint } from './endpoint.abstract';
import { Dictionary } from '../objects/dictionary';
import { Injector } from '@angular/core';
import { HttpResponseHandler } from './httpResponseHandler.interface';

export abstract class BaseApi<DICTIONARY_TYPE_ENUM = any> {
  protected apiCaller: ApiCaller;

  protected endPoints = new Array<Endpoint>();

  protected dictionaries = new Map<DICTIONARY_TYPE_ENUM, GetDictionary<DICTIONARY_TYPE_ENUM>>();

  constructor(
    private injector: Injector,
    httpClient: HttpClient,
    httpCallErrorHandler: HttpResponseHandler,
    apiBaseUrl: string,
  ) {
    this.apiCaller = new ApiCaller(httpClient, httpCallErrorHandler, apiBaseUrl);

    ObjectBuilder.setApi(this);
  }

  public getDictionaryEndpoint(type: DICTIONARY_TYPE_ENUM): GetDictionary {
    return this.dictionaries.get(type);
  }
  public getDictionary(type: DICTIONARY_TYPE_ENUM, useCache?: boolean): Promise<Dictionary> {
    const endpoint = this.getDictionaryEndpoint(type);
    return null == endpoint ? Promise.reject() : endpoint.call(null, useCache);
  }
  public getDictionaryEndpoints(types: Array<DICTIONARY_TYPE_ENUM>): Array<GetDictionary> {
    return types.map((type: DICTIONARY_TYPE_ENUM) => this.dictionaries.get(type));
  }

  public getDictionaries(types: Array<DICTIONARY_TYPE_ENUM>, useCache?: boolean): Promise<Array<Dictionary>> {
    const endpoints = this.getDictionaryEndpoints(types);
    return Promise.all(endpoints.map((endpoint: GetDictionary) => endpoint.call(null, useCache)));
  }
  protected addDefaultHeader(key: string, value: string): this {
    this.apiCaller.addDefaultHeader(key, value);
    return this;
  }
  protected removeDefaultHeader(key: string): this {
    this.apiCaller.removeDefaultHeader(key);
    return this;
  }

  protected addEndpoint(endpoint: Endpoint<any, any>): this {
    this.endPoints.push(endpoint);
    endpoint.init(this.injector, this.apiCaller);
    return this;
  }
  protected addEndpoints(endpoints: Array<Endpoint<any, any>>): this {
    endpoints.forEach((endpoint: Endpoint<any, any>) => {
      this.addEndpoint(endpoint);
    });
    return this;
  }

  protected addDictionary(endpoint: GetDictionary): this {
    endpoint.init(this.injector, this.apiCaller);
    this.dictionaries.set(endpoint.type, endpoint);
    return this;
  }
  protected addDictionaries(endpoints: Array<GetDictionary>): this {
    endpoints.forEach((endpoint: GetDictionary) => {
      this.addDictionary(endpoint);
    });
    return this;
  }
}
