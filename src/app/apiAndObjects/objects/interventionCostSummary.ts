import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';
export class InterventionCostSummary extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    SUMMARY_COSTS: 'summaryCosts',
    DISCOUNT_RATE: 'discountRate',
    SUMMARY_COSTS_DISCOUNTED: 'summaryCostsDiscounted',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;
  public readonly interventionId: number;
  public readonly summaryCosts: Array<SummaryCostBreakdown>;
  public readonly discountRate: string;
  public readonly summaryCostsDiscounted: Array<SummaryCostBreakdown>;
  public readonly costSummary: Array<CostSummary>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionCostSummary.KEYS.INTERVENTION_ID);
    this.summaryCosts = this._getArray(InterventionCostSummary.KEYS.SUMMARY_COSTS);
    this.discountRate = this._getString(InterventionCostSummary.KEYS.DISCOUNT_RATE);
    this.summaryCostsDiscounted = this._getArray(InterventionCostSummary.KEYS.SUMMARY_COSTS_DISCOUNTED);
  }
}
export interface CostSummary {
  summaryCosts: SummaryCostBreakdown;
  discountRate: string;
  summaryCostsDiscounted: SummaryCostBreakdown;
}
export interface SummaryCostBreakdown {
  rowName: string;
  rowIndex: number;
  rowUnits: string;
  labelText: string;
  year0: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  year6: number;
  year7: number;
  year8: number;
  year9: number;
}
