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
  costs: Array<StartUpCosts>;
}

export enum StartUpScaleUpCostCategoryType {
  GOVERNMENT = 'Government-related start-up/scale-up costs',
  INDUSTRY = 'Industry-related start-up/scale-up costs',
}
export interface StartUpCosts {
  section: string;
  costBreakdown: Array<StartUpCostBreakdown>;
  year0Total: number;
  year1Total: number;
}

export interface StartUpCostBreakdown {
  name: string;
  rowIndex: number;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year1: number;
  year1Default: number;
  year1Edited: number;
  rowUnits: string;
  isEditable: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}

export interface StartUpCostSummary {
  category: string;
  year0CombinedTotal: number;
  year1CombinedTotal: number;
}
