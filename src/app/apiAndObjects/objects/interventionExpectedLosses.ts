import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionExpectedLosses extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    EXPECTED_LOSSES: 'expectedLosses',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly expectedLosses: Array<ExpectedLosses>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.interventionId = this._getNumber(InterventionExpectedLosses.KEYS.INTERVENTION_ID);
    this.expectedLosses = this._getArray(InterventionExpectedLosses.KEYS.EXPECTED_LOSSES);
  }
}
export interface ExpectedLosses {
  micronutrient: string;
  expectedLosses: {
    targetVal: number;
    rowIndex: number;
    rowUnits: string;
    expectedLosses: number;
    expectedLossesDefault: number;
    source: string;
  };
}
