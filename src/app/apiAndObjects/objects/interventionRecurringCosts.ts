import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionRecurringCosts extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    RECURRING_COSTS: 'recurringCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly recurringCosts: Array<RecurringCost>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionRecurringCosts.KEYS.INTERVENTION_ID);
    this.recurringCosts = this._getArray(InterventionRecurringCosts.KEYS.RECURRING_COSTS);
  }
}

export interface RecurringCost {
  category: RecurringCostsCategory;
  costs: Array<Costs>;
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
  rowUnits: string;
  isEditable: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}
export enum RecurringCostsCategory {
  GOVERNMENT = 'Government-related recurring monitoring and management costs',
  RECURRING = 'Recurring premix costs',
}
