import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export interface BinValue {
  bin: number;
  frequency: number;
}

export class BiomarkerInfo extends BaseObject implements Exportable {
  public static readonly KEYS = {
    AGE_GROUP: 'ageGenderGroup',
    DATA: 'data',
  };

  public readonly adequacyThreshold: number;
  public readonly data: Array<BinValue>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.adequacyThreshold = this._getNumber(BiomarkerInfo.KEYS.AGE_GROUP);
    this.data = this._getArray(BiomarkerInfo.KEYS.DATA);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'BiomarkerInfoData';
  }
}
