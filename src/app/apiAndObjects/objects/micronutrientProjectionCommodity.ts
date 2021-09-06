import { MicronutrientProjectionSource } from './micronutrientProjectionSource.abstract';

export class MicronutrientProjectionCommodity extends MicronutrientProjectionSource {
  public static readonly KEYS = {
    ...MicronutrientProjectionSource.KEYS,
    COMMODITY: 'commodity',
  };

  public name: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.name = this._getString(MicronutrientProjectionCommodity.KEYS.COMMODITY);
  }
}
