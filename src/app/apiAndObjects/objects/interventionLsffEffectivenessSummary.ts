export interface InterventionLsffEffectivenessSummary {
  admin0Name: string;
  admin1Name: string;
  householdCount: number;
  householdReachCount: number;
  householdReachPerc: number;
  meanFortificantConsumption: number;
  medianFortificantConsumption: number;

  inadequacyCountBaseline: number;
  inadequacyPercBaseline: number;
  excessCountBaseline: number;
  excessPercBaseline: number;

  inadequacyCount: number[];
  inadequacyPerc: number[];
  excessCount: number[];
  excessPerc: number[];
  coverageCount: number[];
  coveragePerc: number[];
}
