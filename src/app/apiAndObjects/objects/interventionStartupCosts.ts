import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionStartupCosts extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    STARTUP_COSTS: 'startupScaleupCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly startupScaleupCosts: Array<StartUpScaleUpCost>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionStartupCosts.KEYS.INTERVENTION_ID);
    this.startupScaleupCosts = this._getArray(InterventionStartupCosts.KEYS.STARTUP_COSTS);
  }
}
export interface StartUpScaleUpCost {
  category: StartUpScaleUpCostCategoryType;
  costs: Array<Costs>;
}

export enum StartUpScaleUpCostCategoryType {
  GOVERNMENT = 'Government-related start-up/scale-up costs',
  INDUSTRY = 'Industry-related start-up/scale-up costs',
}
export interface Costs {
  section: string;
  costBreakdown: Array<CostBreakdown>;
  year0Total: number;
  year1Total: number;
}

export interface CostBreakdown {
  name: string;
  rowIndex: number;
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
  rowUnits: string;
  isEditable: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}
