import { BaseObject } from '../_lib_code/objects/baseObject';
import { InterventionLsffEffectivenessSummary } from './interventionLsffEffectivenessSummary';

export class InterventionLsffEffectivenessSummaryAfe
  extends BaseObject
  implements InterventionLsffEffectivenessSummary
{
  public static readonly KEYS = {
    ADMIN_0_NAME: 'admin0Name',
    ADMIN_1_NAME: 'admin1Name',
    HOUSEHOLD_COUNT: 'householdsCount',
    FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_COUNT: 'fortification_vehicle_reach_hh_count',
    FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_PERCENT: 'fortification_vehicle_reach_hh_count_perc',
    MEAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT: 'meanDailyamountConsumedContainingFortificantInGAfe',
    MEDIAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT: 'medianDailyAmountConsumedContainingFortificantInGAfe',
    INADEQUACY_COUNT_BASELINE: 'base_supply_ear_inadequacy_count',
    INADEQUACY_PERCENT_BASELINE: 'base_supply_ear_inadequacy_count_perc',
    EXCEED_COUNT_BASELINE: 'base_ul_exceedance_count',
    EXCEED_PERCENT_BASELINE: 'base_ul_exceedance_count_perc',
    INADEQUACY_COUNT_2021: '2021_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2021: '2021_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2021: '2021_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2021: '2021_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2021: '2021_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2021: '2021_effective_coverage_count_perc',
    INADEQUACY_COUNT_2022: '2022_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2022: '2022_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2022: '2022_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2022: '2022_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2022: '2022_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2022: '2022_effective_coverage_count_perc',
    INADEQUACY_COUNT_2023: '2023_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2023: '2023_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2023: '2023_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2023: '2023_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2023: '2023_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2023: '2023_effective_coverage_count_perc',
    INADEQUACY_COUNT_2024: '2024_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2024: '2024_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2024: '2024_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2024: '2024_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2024: '2024_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2024: '2024_effective_coverage_count_perc',
    INADEQUACY_COUNT_2025: '2025_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2025: '2025_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2025: '2025_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2025: '2025_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2025: '2025_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2025: '2025_effective_coverage_count_perc',
    INADEQUACY_COUNT_2026: '2026_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2026: '2026_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2026: '2026_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2026: '2026_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2026: '2026_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2026: '2026_effective_coverage_count_perc',
    INADEQUACY_COUNT_2027: '2027_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2027: '2027_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2027: '2027_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2027: '2027_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2027: '2027_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2027: '2027_effective_coverage_count_perc',
    INADEQUACY_COUNT_2028: '2028_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2028: '2028_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2028: '2028_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2028: '2028_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2028: '2028_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2028: '2028_effective_coverage_count_perc',
    INADEQUACY_COUNT_2029: '2029_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2029: '2029_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2029: '2029_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2029: '2029_base_and_lsff_ul_exceedance_count_perc',
    EFFECTIVE_COVERAGE_COUNT_2029: '2029_effective_coverage_count',
    EFFECTIVE_COVERAGE_PERCENT_2029: '2029_effective_coverage_count_perc',
    INADEQUACY_COUNT_2030: '2030_base_and_lsff_ear_inadequacy_count',
    INADEQUACY_PERCENT_2030: '2030_base_and_lsff_ear_inadequacy_count_perc',
    EXCEED_COUNT_2030: '2030_base_and_lsff_ul_exceedance_count',
    EXCEED_PERCENT_2030: '2030_base_and_lsff_ul_exceedance_count_perc',
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

    this.admin0Name = this._getString(InterventionLsffEffectivenessSummaryAfe.KEYS.ADMIN_0_NAME);
    this.admin1Name = this._getString(InterventionLsffEffectivenessSummaryAfe.KEYS.ADMIN_1_NAME);
    this.householdCount = this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS.HOUSEHOLD_COUNT);
    this.householdReachCount = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_COUNT,
    );
    this.householdReachPerc = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.FORTIFICATION_VEHICLE_REACH_HOUSEHOLD_PERCENT,
    );
    this.meanFortificantConsumption = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.MEAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT,
    );
    this.medianFortificantConsumption = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.MEDIAN_DAILY_CONSUMPTION_CONTAINING_FORTIFICANT,
    );

    this.inadequacyCountBaseline = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.INADEQUACY_COUNT_BASELINE,
    );
    this.inadequacyPercBaseline = this._getNumber(
      InterventionLsffEffectivenessSummaryAfe.KEYS.INADEQUACY_PERCENT_BASELINE,
    );
    this.excessCountBaseline = this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS.EXCEED_COUNT_BASELINE);
    this.excessPercBaseline = this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS.EXCEED_PERCENT_BASELINE);

    this.inadequacyCount = [];
    this.inadequacyPerc = [];
    this.excessCount = [];
    this.excessPerc = [];
    this.coverageCount = [];
    this.coveragePerc = [];
    for (const year of [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]) {
      this.inadequacyCount.push(
        this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`INADEQUACY_COUNT_${year}`]),
      );
      this.inadequacyPerc.push(
        this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`INADEQUACY_PERCENT_${year}`]),
      );
      this.excessCount.push(this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`EXCEED_COUNT_${year}`]));
      this.excessPerc.push(this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`EXCEED_PERCENT_${year}`]));
      this.coverageCount.push(
        this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`EFFECTIVE_COVERAGE_COUNT_${year}`]),
      );
      this.coveragePerc.push(
        this._getNumber(InterventionLsffEffectivenessSummaryAfe.KEYS[`EFFECTIVE_COVERAGE_PERCENT_${year}`]),
      );
    }
  }
}
