import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { MapsHttpResponseHandler } from './mapsHttpResponseHandler';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { CountryDictionaryItem } from '../objects/dictionaries/countryRegionDictionaryItem';
import { GetSubRegionData } from './currentData/getSubRegionData';
import { Endpoint } from '../_lib_code/api/endpoint.abstract';
import { GetDietarySources } from './currentData/getDietarySources';
import { GetHouseholdHistogramData } from './currentData/getHouseholdHistogramData';
import { GetMonthlyFoodGroups } from './currentData/getMonthlyFoodGroups';
import { GetProjectedAvailabilities } from './currentData/getProjectedAvailabilities';
import { GetAgeGenderGroups } from './currentData/getAgeGenderGroups';
import { FoodGroupDictionaryItem } from '../objects/dictionaries/foodGroupDictionaryItem';
import { GetCurrentComposition } from './scenario/getCurrentComposition';
import { GetCurrentConsumption } from './scenario/getCurrentConsumption';
import { GetDietChangeFoodItem } from './scenario/getDietChangeFoodItem';
import { GetDietChangeConsumption } from './scenario/getDietChangeConsumption';
import { GetDietChangeComposition } from './scenario/getDietChangeComposition';
import { ImpactScenarioDictionaryItem } from '../objects/dictionaries/impactScenarioDictionaryItem';
import { GetTopFood } from './currentData/getTopFoods';
import { GetDataSources } from './currentData/getDataSources';
import { GetMicronutrientProjectionSources } from './projections/getMicronutrientProjectionSources';
import { GetProjectionSummaries } from './projections/getProjectionSummaries';

@Injectable()
export class ApiService extends BaseApi {
  private static readonly USE_LIVE_API = environment.useLiveApi;

  public readonly endpoints = {
    currentData: {
      getSubRegionData: new GetSubRegionData(ApiService.USE_LIVE_API),
      getDietarySources: new GetDietarySources(false),
      getHouseholdHistogramData: new GetHouseholdHistogramData(false),
      getMonthlyFoodGroups: new GetMonthlyFoodGroups(false),
      getProjectedAvailabilities: new GetProjectedAvailabilities(ApiService.USE_LIVE_API),
      getAgeGenderGroups: new GetAgeGenderGroups(false),
      getTopFoods: new GetTopFood(ApiService.USE_LIVE_API),
      getDataSources: new GetDataSources(ApiService.USE_LIVE_API),
    },
    projections: {
      getMicronutrientProjectionSources: new GetMicronutrientProjectionSources(ApiService.USE_LIVE_API),
      getProjectionSummaries: new GetProjectionSummaries(ApiService.USE_LIVE_API),
    },
    scenario: {
      getCurrentComposition: new GetCurrentComposition(false),
      getCurrentConsumption: new GetCurrentConsumption(false),
      getDietChangeComposition: new GetDietChangeComposition(false),
      getDietChangeConsumption: new GetDietChangeConsumption(false),
      getDietChangeFoodItem: new GetDietChangeFoodItem(false),
    },
    misc: {},
  };

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, ApiService.USE_LIVE_API).setDefaultParams({
      path: 'countries',
      typeObj: CountryDictionaryItem,
    }),
    // .setMockObjects(CountryDictionaryItem.createMockItems(false)),
    new GetDictionary(DictionaryType.REGIONS, false)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(false, 0)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => MicronutrientDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.FOOD_GROUPS, false)
      .setDefaultParams({ path: 'food-groups', typeObj: FoodGroupDictionaryItem })
      .setMockObjects(FoodGroupDictionaryItem.createMockItems(5, 5)),
    new GetDictionary(DictionaryType.IMPACT_SCENARIOS, true).setDefaultParams({
      path: 'diet/projections/scenarios',
      typeObj: ImpactScenarioDictionaryItem,
    }),
  ];

  constructor(httpClient: HttpClient, injector: Injector) {
    super(injector, httpClient, new MapsHttpResponseHandler(injector), environment.apiBaseUrl);

    this.addDictionaries(this._dictionaries);

    // add endpoints
    Object.values(this.endpoints).forEach((group: Record<string, Endpoint<any, any>>) => {
      this.addEndpoints(Object.values(group));
    });

    // this.addDefaultHeader('X-Parse-Application-Id', environment.parseAppName);

    // const tokenHeader = 'x-parse-session-token';
    // accountService.watchForLogin().subscribe(() => {
    //   const token = accountService.getAccessToken();
    //   this.addDefaultHeader(tokenHeader, token);
    // });

    // accountService.watchForLogout().subscribe(() => {
    //   this.removeDefaultHeader(tokenHeader);
    // });
  }
}
