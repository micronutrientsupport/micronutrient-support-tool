import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';

export class InterventionCostEffectivenessSummary extends BaseObject {
  public static readonly KEYS = {
    AVERAGE_ANNUAL_COST: 'averageAnnualCost',
    AVERAGE_EFFECTIVELY_COVERED_HOUSEHOLDS: 'averageEffectivelyCoveredHouseholds',
    COST_PER_COVERED_HOUSEHOLD: 'costPerHouseholdCovered',
  };

  public readonly averageAnnualCost: number;
  public readonly averageEffectivelyCoveredHouseholds: number;
  public readonly costPerHouseholdCovered: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.averageAnnualCost = this._getNumber(InterventionCostEffectivenessSummary.KEYS.AVERAGE_ANNUAL_COST);
    this.averageEffectivelyCoveredHouseholds = this._getNumber(
      InterventionCostEffectivenessSummary.KEYS.AVERAGE_EFFECTIVELY_COVERED_HOUSEHOLDS,
    );
    this.costPerHouseholdCovered = this._getNumber(
      InterventionCostEffectivenessSummary.KEYS.COST_PER_COVERED_HOUSEHOLD,
    );
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
