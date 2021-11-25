import { MnAvailibiltyItem } from './mnAvailibilityItem.abstract';

export class MnAvailibiltyCountryItem extends MnAvailibiltyItem {
  public static readonly KEYS = {
    ...MnAvailibiltyItem.KEYS,
  };

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
  }
}

export interface ExtendedRespose<Type> {
  data: Type[];
  meta: {
    [key: string]: {
      desc: string;
      data: unknown;
    };
  };
}
