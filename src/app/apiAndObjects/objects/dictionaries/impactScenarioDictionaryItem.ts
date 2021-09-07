import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class ImpactScenarioDictionaryItem extends MapsDictionaryItem {
  public static readonly KEYS = {
    BRIEF_DESCRIPTION: 'briefDescription',
    IS_BASELINE: 'isBaseline',
  };

  public readonly briefDescription: string;
  public readonly isBaseline: boolean;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
    super(sourceObject, id, name, description);

    this.briefDescription = this._getString(ImpactScenarioDictionaryItem.KEYS.BRIEF_DESCRIPTION);
    this.isBaseline = this._getBoolean(ImpactScenarioDictionaryItem.KEYS.IS_BASELINE);
  }
}
