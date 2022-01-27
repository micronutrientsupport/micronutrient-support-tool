import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionBaselineAssumptions extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    BASELINE_ASSUMPTIONS: 'baselineAssumptions',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly baselineAssumptions: BaselineAssumptions | unknown;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionBaselineAssumptions.KEYS.INTERVENTION_ID);
    this.baselineAssumptions = this._getValue(InterventionBaselineAssumptions.KEYS.BASELINE_ASSUMPTIONS);
  }
}

export interface BaselineAssumptions {
  potentiallyFortified: PotentiallyFortified;
  actuallyFortified: ActuallyFortified;
}

export interface PotentiallyFortified {
  title: string;
  rowIndex: number;
  rowUnits: string;
  isEditable: true;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year2: number;
  year2Default: number;
  year2Edited: number;
  year3: number;
  year3Default: number;
  year3Edited: number;
  year4: number;
  year4Default: number;
  year4Edited: number;
  year5: number;
  year5Default: number;
  year5Edited: number;
  year6: number;
  year6Default: number;
  year6Edited: number;
  year7: number;
  year7Default: number;
  year7Edited: number;
  year8: number;
  year8Default: number;
  year8Edited: number;
  year9: number;
  year9Default: number;
  year9Edited: number;
  dataSource: number;
  numberdataCitation: number;
}

export interface ActuallyFortified {
  title: string;
  rowIndex: number;
  rowUnits: string;
  isEditable: true;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year2: number;
  year2Default: number;
  year2Edited: number;
  year3: number;
  year3Default: number;
  year3Edited: number;
  year4: number;
  year4Default: number;
  year4Edited: number;
  year5: number;
  year5Default: number;
  year5Edited: number;
  year6: number;
  year6Default: number;
  year6Edited: number;
  year7: number;
  year7Default: number;
  year7Edited: number;
  year8: number;
  year8Default: number;
  year8Edited: number;
  year9: number;
  year9Default: number;
  year9Edited: number;
  dataSource: number;
  numberdataCitation: number;
}
