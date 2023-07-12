import { BaseObject } from '../_lib_code/objects/baseObject';

export class RegisterLoginResponseError extends BaseObject {
  public static readonly KEYS = {
    DATA: 'data',
    META: 'meta',
    MSG: 'msg',
    PROPS: 'props',
    TYPE: 'type',
  };

  public readonly data: string;
  public readonly meta: unknown;
  public readonly msg: string;
  public readonly props: unknown;
  public readonly type: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.data = this._getString(RegisterLoginResponseError.KEYS.DATA);
    this.meta = this._getValue(RegisterLoginResponseError.KEYS.META);
    this.msg = this._getString(RegisterLoginResponseError.KEYS.MSG);
    this.props = this._getValue(RegisterLoginResponseError.KEYS.PROPS);
    this.type = this._getString(RegisterLoginResponseError.KEYS.TYPE);
  }
}
