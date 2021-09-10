import { MnAvailibiltyItem } from './mnAvailibilityItem.abstract';

export class MnAvailibiltyCountryItem extends MnAvailibiltyItem {
  public static readonly KEYS = {
    ...MnAvailibiltyItem.KEYS,
  };

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
  }
}
