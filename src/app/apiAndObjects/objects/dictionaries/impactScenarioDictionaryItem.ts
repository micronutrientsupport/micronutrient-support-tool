import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { lastValueFrom } from 'rxjs';
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

  public static getMockItems(injector: Injector): Promise<Array<Record<string, unknown>>> {
    const httpClient = injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return lastValueFrom(httpClient.get('/assets/exampleData/impact_scenarios.json')) as Promise<
      Array<Record<string, unknown>>
    >;
  }
}
