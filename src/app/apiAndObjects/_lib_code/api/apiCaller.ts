import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponseHandler } from './httpResponseHandler.interface';

export enum RequestMethod {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE, // OPTIONS, TRACE, HEAD,
}

export class ApiCaller {
  private headers = new HttpHeaders();

  constructor(private http: HttpClient, private httpCallErrorHandler: HttpResponseHandler, private baseUrl: string) {}

  public doCall(
    segments: string | Array<string>,
    requestMethod: RequestMethod,
    queryParams = {},
    bodyData: object | FormData = {},
    headerFilter?: (headers: HttpHeaders) => HttpHeaders,
  ): Promise<any> {
    const url = this.getUrl(segments);
    // console.debug('doCall', url, requestMethod, queryParams, bodyData);
    const options = {
      headers: null != headerFilter ? headerFilter(this.headers) : this.headers,
      params: queryParams,
    };

    let response: Observable<any>;
    switch (requestMethod) {
      case RequestMethod.GET:
        response = this.http.get(url, options);
        break;
      case RequestMethod.DELETE:
        response = this.http.delete(url, options);
        break;
      case RequestMethod.POST:
        response = this.http.post(url, bodyData, options);
        break;
      case RequestMethod.PATCH:
        response = this.http.patch(url, bodyData, options);
        break;
      case RequestMethod.PUT:
        response = this.http.put(url, bodyData, options);
        break;
    }
    if (response != null) {
      return response
        .toPromise()
        .then((responseJson: any) => {
          return this.httpCallErrorHandler.handleSuccess(responseJson);
        })
        .catch((res) => {
          console.log('doCall handleError', res);
          return null != this.httpCallErrorHandler ? this.httpCallErrorHandler.handleError(res) : res;
        });
    }
    return null;
  }

  private getUrl(segments: string | Array<string>): string {
    segments = Array.isArray(segments) ? segments : [segments];

    const url = `${this.baseUrl}/${segments.join('/')}`;
    return url;
  }

  public addDefaultHeader(key: string, value: string): this {
    this.headers = this.headers.append(key, value);
    return this;
  }

  public removeDefaultHeader(key: string): this {
    this.headers = this.headers.delete(key);
    return this;
  }
}
