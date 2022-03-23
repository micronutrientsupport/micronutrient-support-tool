/* eslint-disable @typescript-eslint/ban-types */
export interface ApiResponse {
  [x: string]: unknown;
  readonly msg: string;
  readonly type: string;
  readonly self: string;
  readonly props: Array<object>;
  readonly data: unknown;
  readonly meta: unknown;
}
