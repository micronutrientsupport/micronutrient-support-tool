/* eslint-disable @typescript-eslint/ban-types */
export interface ApiResponse {
  readonly msg: string;
  readonly type: string;
  readonly self: string;
  readonly props: Array<object>;
  readonly data: any;
  readonly meta: any;
}
