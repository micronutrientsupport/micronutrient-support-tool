
export interface HttpCallErrorHandler {
  handleError(response: any): Promise<any>;
}
