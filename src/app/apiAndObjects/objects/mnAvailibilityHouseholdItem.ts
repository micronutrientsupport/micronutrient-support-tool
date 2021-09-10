import { MnAvailibiltyItem } from './mnAvailibilityItem.abstract';

export class MnAvailibiltyHouseholdItem extends MnAvailibiltyItem {
  public static readonly KEYS = {
    ...MnAvailibiltyItem.KEYS,
    DEFICIENT_COUNT: 'deficientCount',
    HOUSEHOLD_COUNT: 'householdCount',
  };

  public readonly deficientCount: number;
  public readonly householdCount: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.deficientCount = this._getNumber(MnAvailibiltyHouseholdItem.KEYS.DEFICIENT_COUNT);
    this.householdCount = this._getNumber(MnAvailibiltyHouseholdItem.KEYS.HOUSEHOLD_COUNT);
  }
}
