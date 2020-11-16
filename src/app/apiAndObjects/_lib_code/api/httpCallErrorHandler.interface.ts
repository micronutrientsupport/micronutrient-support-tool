
export interface HttpCallErrorHandler<ResponseType = any> {
  handleSuccess(response: ResponseType): Promise<ResponseType>;
  handleError(response: any): Promise<ResponseType>;
}
