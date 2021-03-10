import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponseHandler } from './httpResponseHandler.interface';
import { RequestMethod } from './requestMethod.enum';

export class ApiCaller {
  private headers = new HttpHeaders();

  /**
   * @param http An HttpClient object used to make the http calls.
   * @param httpCallErrorHandler A handler for post processing of http responses and errors
   * @param baseUrl The base url to append any relative url segments to.
   */
  constructor(private http: HttpClient, private httpCallErrorHandler: HttpResponseHandler, private baseUrl: string) {}

  /**
   * Does an http call using the parameters given
   *
   * @param urlSegments The url as a string or arrray of srtrings that will be joined with '/' characters.
   * @param requestMethod The http request method to use.
   * @param queryParams An object containing key-value pairs that make up the query parameters.
   * @param bodyData The body of the http call.
   * @param headerFilter A function allowing the filtering out of any http headers set, or adding of them for this call only
   */
  public doCall(
    urlSegments: string | Array<string>,
    requestMethod: RequestMethod,
    queryParams: Record<string, string | Array<string>> = {},
    bodyData: Record<string, unknown> | FormData | Array<unknown> = {},
    headerFilter?: (headers: HttpHeaders) => HttpHeaders,
  ): Promise<unknown> {
    const url = this.getUrl(urlSegments);
    // console.log('doCall', url, requestMethod, queryParams, bodyData);
    const options = {
      headers: null != headerFilter ? headerFilter(this.headers) : this.headers,
      params: queryParams,
    };

    let response: Observable<unknown>;
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
        .then((responseJson: unknown) => this.httpCallErrorHandler.handleSuccess(responseJson))
        .catch((res: unknown) => {
          console.log('doCall handleError', res);
          return null != this.httpCallErrorHandler ? this.httpCallErrorHandler.handleError(res) : res;
        });
    }
    return null;
  }

  /**
   * Adds an http header that will be added to every call (unless subsequently filtered)
   *
   * @param key Header key
   * @param value Header value
   */
  public addDefaultHeader(key: string, value: string): this {
    this.headers = this.headers.append(key, value);
    return this;
  }

  /**
   * Removed an http header that was previously added
   *
   * @param key Header key
   */
  public removeDefaultHeader(key: string): this {
    this.headers = this.headers.delete(key);
    return this;
  }

  private getUrl(segments: string | Array<string>): string {
    segments = Array.isArray(segments) ? segments : [segments];

    const url = `${this.baseUrl}/${segments.join('/')}`;
    return url;
  }
}
