import { ApiResponse } from '../_lib_code/api/apiResponse.interface';
import { Injector } from '@angular/core';

export class MyHttpCallErrorHandler {
  constructor(
    injector: Injector,
  ) {
  }

  /*
   * Creates an error for a promise.
   */
  public handleError(res: any): Promise<any> {
    // TODO: Check response meta
    // TODO: Output to console?
    // console.debug(res);
    const body = res.error; // .error is the body of the response?
    let returnValue: ApiResponse;
    let errorMessage = '';

    switch (true) {
      case (res.ok === false): errorMessage = res.message; break;
      case ((res.status === 404) && (typeof body !== 'string')): returnValue = body; break; // just an empty dataset
      case (typeof body !== 'string'): errorMessage = body.msg; break;
      default: errorMessage = res.message; break;
    }
    // console.debug('error message', errorMessage, returnValue, res);

    if (errorMessage) {
      console.warn('An error occurred - ', errorMessage);
      return Promise.reject(errorMessage);
    } else {
      return Promise.resolve(returnValue);
    }
  }

}
