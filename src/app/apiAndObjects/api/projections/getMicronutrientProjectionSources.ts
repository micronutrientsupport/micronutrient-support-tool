import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientProjectionSource } from '../../objects/micronutrientProjectionSource.abstract';
import { MicronutrientProjectionCommodity } from '../../objects/micronutrientProjectionCommodity';
import { MicronutrientProjectionFoodGroup } from '../../objects/micronutrientProjectionFoodGroup';
import { FoodSourceGroup } from '../../objects/enums/foodSourceGroup.enum';
import { ImpactScenarioDictionaryItem } from '../../objects/dictionaries/impactScenarioDictionaryItem';

export class GetMicronutrientProjectionSources extends CacheableEndpoint<
  Array<MicronutrientProjectionSource>,
  GetMicronutrientProjectionSourcesParams,
  MicronutrientProjectionSource
> {
  protected getCacheKey(params: GetMicronutrientProjectionSourcesParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetMicronutrientProjectionSourcesParams): Promise<Array<MicronutrientProjectionSource>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', 'projections', this.getFoodSourceGroupSegment(params.foodSourceGroup)],
      RequestMethod.GET,
      this.removeNullsFromObject({
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
        scenarioId: params.scenario.id,
        year: params.year,
      }) as Record<string, string>,
    );

    const objType =
      params.foodSourceGroup === FoodSourceGroup.COMMODITY
        ? MicronutrientProjectionCommodity
        : MicronutrientProjectionFoodGroup;
    return this.buildObjectsFromResponse(objType, callResponsePromise);
  }

  protected callMock(): Promise<Array<MicronutrientProjectionSource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      MicronutrientProjectionCommodity,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/impact_commodity_aggregation.json').toPromise());
        }, 1500);
      }),
    );
  }

  private getFoodSourceGroupSegment(foodSourceGroup: FoodSourceGroup): string {
    switch (foodSourceGroup) {
      case FoodSourceGroup.COMMODITY:
        return 'commodities';
      case FoodSourceGroup.FOOD_GROUP:
        return 'food-groups';
    }
  }
}

export interface GetMicronutrientProjectionSourcesParams {
  foodSourceGroup: FoodSourceGroup;
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  scenario: ImpactScenarioDictionaryItem;
  year?: string;
}
