import { DietDataSource } from '../../objects/dietDataSource';
import { DataLevel } from '../../objects/enums/dataLevel.enum';
import { MnAvailibiltyCountryItem } from '../../objects/mnAvailibilityCountryItem';
import { MnAvailibiltyHouseholdItem } from '../../objects/mnAvailibilityHouseholdItem';

export type MN_AVAILABILITY_TYPE = MnAvailibiltyCountryItem | MnAvailibiltyHouseholdItem;

export class MnAvailabilityEndpointHelper {
  public static getObjectType(
    dietDataSource: DietDataSource,
  ): typeof MnAvailibiltyCountryItem | typeof MnAvailibiltyHouseholdItem {
    switch (dietDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return MnAvailibiltyCountryItem;
      case DataLevel.HOUSEHOLD:
        return MnAvailibiltyHouseholdItem;
    }
  }
  public static getDataLevelSegment(dietDataSource: DietDataSource): string {
    switch (dietDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return 'country';
      case DataLevel.HOUSEHOLD:
        return 'household';
    }
  }
}
