import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { FeedbackResponse } from '../../objects/feedbackResponse';

export class postFeedback extends Endpoint<FeedbackResponse, PostFeedbackParams, FeedbackResponse> {
  protected callLive(params: PostFeedbackParams): Promise<FeedbackResponse> {
    const callResponsePromise = this.apiCaller.doCall(['feedback'], RequestMethod.POST, null, {
      rating: params.rate,
      comment: params.comment,
      screenshot: params.screenshot,
      page: params.page,
      browser: params.browser,
      os: params.os,
      width: params.width,
      height: params.height,
    });
    return this.buildObjectFromResponse(FeedbackResponse, callResponsePromise);
  }
  protected callMock(): Promise<FeedbackResponse> {
    const promise = Promise.resolve({ success: true });
    return this.buildObjectFromResponse(FeedbackResponse, promise);
  }
}

export interface PostFeedbackParams {
  rate: number;
  comment: string;
  page: string;
  browser?: string;
  os?: string;
  width?: number;
  height?: number;
  screenshot: string; // base64 encoded
}
