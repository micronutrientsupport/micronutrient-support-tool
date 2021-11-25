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
    // console.debug(res);
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
  public handleError(res: any): Promise<any> {
    // TODO: Check response meta
    // TODO: Output to console?
    // console.debug(res);
    const body = res.error; // .error is the body of the response?
    let returnValue: ApiResponse;
    let errorMessage = '';

    switch (true) {
      case res.ok === false:
        errorMessage = res.message;
        break;
      case res.status === 404 && typeof body !== 'string':
        returnValue = body;
        break; // just an empty dataset
      case typeof body !== 'string':
        errorMessage = body.msg;
        break;
      default:
        errorMessage = res.message;
        break;
    }
    // console.debug('error message', errorMessage, returnValue, res);

    if (errorMessage) {
      console.error('API access error - ', errorMessage);
      this.notificationsService.sendNegative('API Error - ', 'A call to retrieve data failed');
      return Promise.reject(errorMessage);
    } else {
      return Promise.resolve(returnValue);
    }
  }
}
