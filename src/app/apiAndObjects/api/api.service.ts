import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { MapsHttpResponseHandler } from './mapsHttpResponseHandler';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { Endpoint } from '../_lib_code/api/endpoint.abstract';
import { GetHouseholdHistogramData } from './currentData/getHouseholdHistogramData';
import { GetMonthlyFoodGroups } from './currentData/getMonthlyFoodGroups';
import { FoodGroupDictionaryItem } from '../objects/dictionaries/foodGroupDictionaryItem';
import { GetCurrentComposition } from './scenario/getCurrentComposition';
import { GetCurrentConsumption } from './scenario/getCurrentConsumption';
import { GetDietChangeFoodItem } from './scenario/getDietChangeFoodItem';
import { GetDietChangeConsumption } from './scenario/getDietChangeConsumption';
import { GetDietChangeComposition } from './scenario/getDietChangeComposition';
import { ImpactScenarioDictionaryItem } from '../objects/dictionaries/impactScenarioDictionaryItem';
import { GetTopFood } from './diet/getTopFoods';
import { GetMicronutrientProjectionSources } from './projections/getMicronutrientProjectionSources';
import { GetProjectionSummaries } from './projections/getProjectionSummaries';
import { GetProjectionTotals } from './projections/getProjectionTotals';
import { AgeGenderDictionaryItem } from '../objects/dictionaries/ageGenderDictionaryItem';
import { GetDietDataSources } from './diet/getDietDataSources';
import { GetBiomarkerDataSources } from './biomarker/getBiomarkerDataSources';
import { GetMicronutrientAvailability } from './diet/getMicronutrientAvailability';
import { CountryDictionaryItem } from '../objects/dictionaries/countryDictionaryItem';

@Injectable()
export class ApiService extends BaseApi {
  // turn on mock data by setting this to false
  private static readonly USE_LIVE_API = environment.useLiveApi;

  public readonly endpoints = {
    currentData: {
      getHouseholdHistogramData: new GetHouseholdHistogramData(false),
      getMonthlyFoodGroups: new GetMonthlyFoodGroups(false),
    },
    diet: {
      getTopFoods: new GetTopFood(ApiService.USE_LIVE_API),
      getDataSources: new GetDietDataSources(ApiService.USE_LIVE_API),
      getMicronutrientAvailability: new GetMicronutrientAvailability(ApiService.USE_LIVE_API),
    },
    biomarker: {
      getDataSources: new GetBiomarkerDataSources(ApiService.USE_LIVE_API),
    },
    projections: {
      getMicronutrientProjectionSources: new GetMicronutrientProjectionSources(ApiService.USE_LIVE_API),
      getProjectionSummaries: new GetProjectionSummaries(ApiService.USE_LIVE_API),
      getProjectionTotals: new GetProjectionTotals(ApiService.USE_LIVE_API),
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
    new GetDictionary(DictionaryType.COUNTRIES, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'countries',
        typeObj: CountryDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => CountryDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.REGIONS, false)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => CountryDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => MicronutrientDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.FOOD_GROUPS, false)
      .setDefaultParams({ path: 'food-groups', typeObj: FoodGroupDictionaryItem })
      .setMockObjects(FoodGroupDictionaryItem.createMockItems(5, 5)),
    new GetDictionary(DictionaryType.IMPACT_SCENARIOS, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'diet/projections/scenarios',
        typeObj: ImpactScenarioDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => ImpactScenarioDictionaryItem.getMockItems(injector)),
    new GetDictionary(DictionaryType.AGE_GENDER_GROUPS, ApiService.USE_LIVE_API)
      .setDefaultParams({
        path: 'biomarker/age-gender-groups',
        typeObj: AgeGenderDictionaryItem,
      })
      .setMockObjectsCreatorFunc((injector) => AgeGenderDictionaryItem.getMockItems(injector)),
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
