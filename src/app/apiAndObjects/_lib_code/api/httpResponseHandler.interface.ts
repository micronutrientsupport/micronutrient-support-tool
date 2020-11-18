export interface HttpResponseHandler<ResponseType = unknown> {
  handleSuccess(response: ResponseType): Promise<ResponseType>;
  handleError(response: unknown): Promise<ResponseType>;
}
