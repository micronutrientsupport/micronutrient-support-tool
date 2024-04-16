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
  costs: Array<RecurringCosts>;
}
export interface RecurringCosts {
  section: string;
  costBreakdown: Array<RecurringCostBreakdown>;
  year0Total: number;
  year1Total: number;
  year2Total: number;
  year3Total: number;
  year4Total: number;
  year5Total: number;
  year6Total: number;
  year7Total: number;
  year8Total: number;
  year9Total: number;
}
export interface RecurringCostBreakdown {
  labelText: string;
  rowIndex: number;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year0Overriden: boolean;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year1Overriden: boolean;
  year2: number;
  year2Default: number;
  year2Edited: number;
  year2Overriden: boolean;
  year3: number;
  year3Default: number;
  year3Edited: number;
  year3Overriden: boolean;
  year4: number;
  year4Default: number;
  year4Edited: number;
  year4Overriden: boolean;
  year5: number;
  year5Default: number;
  year5Edited: number;
  year5Overriden: boolean;
  year6: number;
  year6Default: number;
  year6Edited: number;
  year6Overriden: boolean;
  year7: number;
  year7Default: number;
  year7Edited: number;
  year7Overriden: boolean;
  year8: number;
  year8Default: number;
  year8Edited: number;
  year8Overriden: boolean;
  year9: number;
  year9Default: number;
  year9Edited: number;
  year9Overriden: boolean;
  rowUnits: string;
  isEditable: boolean;
  isCalculated: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}

export interface RecurringCostSummary {
  category: string;
  year0CombinedTotal: number;
  year1CombinedTotal: number;
  year2CombinedTotal: number;
  year3CombinedTotal: number;
  year4CombinedTotal: number;
  year5CombinedTotal: number;
  year6CombinedTotal: number;
  year7CombinedTotal: number;
  year8CombinedTotal: number;
  year9CombinedTotal: number;
}

export enum RecurringCostsCategory {
  GOVERNMENT = 'Government-related recurring monitoring and management costs',
  RECURRING = 'Recurring premix costs',
}
