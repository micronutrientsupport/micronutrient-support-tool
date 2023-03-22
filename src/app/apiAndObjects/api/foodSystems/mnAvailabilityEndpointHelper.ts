import { FoodSystemsDataSource } from '../../objects/foodSystemsDataSource';
import { DataLevel } from '../../objects/enums/dataLevel.enum';
import { MnAvailibiltyCountryItem } from '../../objects/mnAvailibilityCountryItem';
import { MnAvailibiltyHouseholdItem } from '../../objects/mnAvailibilityHouseholdItem';

export type MN_AVAILABILITY_TYPE = MnAvailibiltyCountryItem | MnAvailibiltyHouseholdItem;

export class MnAvailabilityEndpointHelper {
  public static getObjectType(
    FoodSystemsDataSource: FoodSystemsDataSource,
  ): typeof MnAvailibiltyCountryItem | typeof MnAvailibiltyHouseholdItem {
    switch (FoodSystemsDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return MnAvailibiltyCountryItem;
      case DataLevel.HOUSEHOLD:
        return MnAvailibiltyHouseholdItem;
    }
  }
  public static getDataLevelSegment(FoodSystemsDataSource: FoodSystemsDataSource): string {
    switch (FoodSystemsDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return 'country';
      case DataLevel.HOUSEHOLD:
        return 'household';
    }
  }
}
