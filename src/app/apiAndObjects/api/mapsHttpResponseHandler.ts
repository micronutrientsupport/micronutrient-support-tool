import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { ApiResponse } from './apiResponse.interface';

export class MapsHttpResponseHandler {
  private readonly notificationsService: NotificationsService;
  constructor(private injector: Injector) {
    this.notificationsService = injector.get<NotificationsService>(NotificationsService);
  }

  public static createMockResponseObject(dataIn: unknown, success = true): Promise<ApiResponse> {
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

  public handleSuccess(res: ApiResponse, fullResponse = false): Promise<unknown> {
    return new Promise((resolve, reject) => {
      // validate that it has a data attribute
      if (undefined === res.data) {
        // add a message to be handled by the handleError method
        reject({
          message: 'Internally generated error: No data attribute in api response',
          response: res,
        });
      } else {
        if (fullResponse) {
          // return the full response
          resolve(res);
        } else {
          // return the data element
          resolve(res.data);
        }
      }
    });
  }

  /*
   * Creates an error for a promise.
   */
  public handleError(res: HttpErrorResponse): Promise<unknown> {
    // TODO: Check response meta
    // TODO: Output to console?
    if (res.error) {
      const body = res.error; // .error is the body of the response?
      let returnValue: ApiResponse;
      let error: unknown;

      switch (true) {
        case res.ok === false:
          error = res;
          break;
        case res.status === 404 && typeof body !== 'string':
          returnValue = body;
          break; // just an empty dataset
        case typeof body !== 'string':
          error = body.msg;
          break;
        default:
          error = res;
          break;
      }
      // console.debug('error message', errorMessage, returnValue, res);

      if (error) {
        const httpErr = error as HttpErrorResponse;
        if (httpErr) {
          console.error('API access error - ', httpErr.message);
          this.notificationsService.sendNegative('API Error - ', 'A call to retrieve data failed');
          return Promise.reject(httpErr);
        } else {
          return Promise.resolve(returnValue);
        }
      }
    }
  }
}
