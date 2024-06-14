import { BaseObject } from '../_lib_code/objects/baseObject';
import { InterventionLsffEffectivenessSummary } from './interventionLsffEffectivenessSummary';

export class InterventionLsffEffectivenessSummaryCnd
  extends BaseObject
  implements InterventionLsffEffectivenessSummary
{
  public static readonly KEYS = {
    ADMIN_0_NAME: 'admin0Name',
    ADMIN_1_NAME: 'admin1Name',
    HOUSEHOLD_COUNT: 'householdsCount',
    FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_COUNT: 'fortification_vehicle_reach_hh_count',
    FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_PERCENT: 'fortification_vehicle_reach_hh_count_perc',
    MEAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT: 'meanDailyamountConsumedContainingFortificantInGPerAfe',
    MEDIAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT: 'medianDailyamountConsumedContainingFortificantInGPerAfe',
    INADEQUACY_COUNT_BASELINE: 'cnd_inadequacy_count',
    INADEQUACY_PERCENT_BASELINE: 'cnd_inadequacy_count_perc',
    // EXCEED_COUNT_BASELINE: 'base_ul_exceedance_count',
    // EXCEED_PERCENT_BASELINE: 'base_ul_exceedance_count_perc',
    INADEQUACY_COUNT_2021: '2021_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2021: '2021_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2021: '2021_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2021: '2021_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2021: '2021_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2021: '2021_effective_coverage_count_perc',
    INADEQUACY_COUNT_2022: '2022_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2022: '2022_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2022: '2022_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2022: '2022_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2022: '2022_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2022: '2022_effective_coverage_count_perc',
    INADEQUACY_COUNT_2023: '2023_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2023: '2023_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2023: '2023_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2023: '2023_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2023: '2023_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2023: '2023_effective_coverage_count_perc',
    INADEQUACY_COUNT_2024: '2024_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2024: '2024_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2024: '2024_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2024: '2024_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2024: '2024_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2024: '2024_effective_coverage_count_perc',
    INADEQUACY_COUNT_2025: '2025_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2025: '2025_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2025: '2025_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2025: '2025_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2025: '2025_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2025: '2025_effective_coverage_count_perc',
    INADEQUACY_COUNT_2026: '2026_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2026: '2026_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2026: '2026_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2026: '2026_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2026: '2026_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2026: '2026_effective_coverage_count_perc',
    INADEQUACY_COUNT_2027: '2027_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2027: '2027_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2027: '2027_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2027: '2027_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2027: '2027_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2027: '2027_effective_coverage_count_perc',
    INADEQUACY_COUNT_2028: '2028_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2028: '2028_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2028: '2028_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2028: '2028_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2028: '2028_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2028: '2028_effective_coverage_count_perc',
    INADEQUACY_COUNT_2029: '2029_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2029: '2029_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2029: '2029_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2029: '2029_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2029: '2029_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2029: '2029_effective_coverage_count_perc',
    INADEQUACY_COUNT_2030: '2030_BaseAndLSFF_cnd_inadequacy_count',
    INADEQUACY_PERCENT_2030: '2030_BaseAndLSFF_cnd_inadequacy_count_perc',
    EXCEED_COUNT_2030: '2030_BaseAndLSFF_cul_exceedence_count',
    EXCEED_PERCENT_2030: '2030_BaseAndLSFF_cul_exceedence_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2030: '2030_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2030: '2030_effective_coverage_count_perc',
  };

  public readonly admin0Name: string;
  public readonly admin1Name: string;
  public readonly householdCount: number;
  public readonly householdReachCount: number;
  public readonly householdReachPerc: number;
  public readonly meanFortificantConsumption: number;
  public readonly medianFortificantConsumption: number;

  public readonly inadequacyCountBaseline: number;
  public readonly inadequacyPercBaseline: number;
  public readonly excessCountBaseline: number;
  public readonly excessPercBaseline: number;

  public readonly inadequacyCount: number[];
  public readonly inadequacyPerc: number[];
  public readonly excessCount: number[];
  public readonly excessPerc: number[];
  public readonly coverageCount: number[];
  public readonly coveragePerc: number[];

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.admin0Name = this._getString(InterventionLsffEffectivenessSummaryCnd.KEYS.ADMIN_0_NAME);
    this.admin1Name = this._getString(InterventionLsffEffectivenessSummaryCnd.KEYS.ADMIN_1_NAME);
    this.householdCount = this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS.HOUSEHOLD_COUNT);
    this.householdReachCount = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_COUNT,
    );
    this.householdReachPerc = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_PERCENT,
    );
    this.meanFortificantConsumption = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.MEAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT,
    );
    this.medianFortificantConsumption = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.MEDIAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT,
    );

    this.inadequacyCountBaseline = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.INADEQUACY_COUNT_BASELINE,
    );
    this.inadequacyPercBaseline = this._getNumber(
      InterventionLsffEffectivenessSummaryCnd.KEYS.INADEQUACY_PERCENT_BASELINE,
    );
    this.excessCountBaseline = null; //this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS.EXCEED_COUNT_BASELINE);
    this.excessPercBaseline = null; //this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS.EXCEED_PERCENT_BASELINE);

    this.inadequacyCount = [];
    this.inadequacyPerc = [];
    this.excessCount = [];
    this.excessPerc = [];
    this.coverageCount = [];
    this.coveragePerc = [];
    for (const year of [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]) {
      this.inadequacyCount.push(
        this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`INADEQUACY_COUNT_${year}`]),
      );
      this.inadequacyPerc.push(
        this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`INADEQUACY_PERCENT_${year}`]),
      );
      this.excessCount.push(this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`EXCEED_COUNT_${year}`]));
      this.excessPerc.push(this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`EXCEED_PERCENT_${year}`]));
      this.coverageCount.push(
        this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`EFFECTIVE_COVERAGE_COUNT_${year}`]),
      );
      this.coveragePerc.push(
        this._getNumber(InterventionLsffEffectivenessSummaryCnd.KEYS[`EFFECTIVE_COVERAGE_PERCENT_${year}`]),
      );
    }
  }
}
