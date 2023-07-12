export interface HttpResponseHandler<ResponseType = unknown> {
  /**
   * Called following a successful http call and gives the implementor chance to
   * perform a consistant action upon call success (like extracting the data from the response)
   */
  handleSuccess(response: ResponseType, fullResponse?: boolean): Promise<ResponseType>;
  /**
   * Called following an unsuccessful http call and gives the implementor chance to
   * perform a consistant action upon call failure
   */
  handleError(response: unknown): Promise<ResponseType>;
}
