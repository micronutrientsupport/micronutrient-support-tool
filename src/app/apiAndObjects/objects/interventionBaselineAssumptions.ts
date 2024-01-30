import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';
import * as jsonLogic from 'json-logic-js';

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
  averageFortificationLevel: AverageFortificationLevel;
}

export interface PotentiallyFortified {
  labelText: string;
  rowIndex: number;
  rowUnits: string;
  isEditable: true;
  isCalculated: boolean;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year0Overriden: boolean;
  year0Formula: jsonLogic.RulesLogic;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year1Overriden: boolean;
  year1Formula: jsonLogic.RulesLogic;
  year2: number;
  year2Default: number;
  year2Edited: number;
  year2Overriden: boolean;
  year2Formula: jsonLogic.RulesLogic;
  year3: number;
  year3Default: number;
  year3Edited: number;
  year3Overriden: boolean;
  year3Formula: jsonLogic.RulesLogic;
  year4: number;
  year4Default: number;
  year4Edited: number;
  year4Overriden: boolean;
  year4Formula: jsonLogic.RulesLogic;
  year5: number;
  year5Default: number;
  year5Edited: number;
  year5Overriden: boolean;
  year5Formula: jsonLogic.RulesLogic;
  year6: number;
  year6Default: number;
  year6Edited: number;
  year6Overriden: boolean;
  year6Formula: jsonLogic.RulesLogic;
  year7: number;
  year7Default: number;
  year7Edited: number;
  year7Overriden: boolean;
  year7Formula: jsonLogic.RulesLogic;
  year8: number;
  year8Default: number;
  year8Edited: number;
  year8Overriden: boolean;
  year8Formula: jsonLogic.RulesLogic;
  year9: number;
  year9Default: number;
  year9Edited: number;
  year9Overriden: boolean;
  year9Formula: jsonLogic.RulesLogic;
  dataSource: number;
  numberdataCitation: number;
}

export type ActuallyFortified = PotentiallyFortified;
export type AverageFortificationLevel = PotentiallyFortified;
