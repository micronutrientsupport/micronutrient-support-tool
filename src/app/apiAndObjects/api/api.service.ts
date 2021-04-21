import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { MapsHttpResponseHandler } from './mapsHttpResponseHandler';
import { GetDataSources } from './currentData/getDataSources';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { CountryDictionaryItem } from '../objects/dictionaries/countryRegionDictionaryItem';
import { GetSubRegionData } from './currentData/getSubRegionData';
import { Endpoint } from '../_lib_code/api/endpoint.abstract';
import { GetDietarySources } from './currentData/getDietarySources';
import { GetTopFood } from './currentData/getTopFood';
import { GetHouseholdHistogramData } from './currentData/getHouseholdHistogramData';
import { GetMonthlyFoodGroups } from './currentData/getMonthlyFoodGroups';
import { GetImpactScenarios } from './misc/getImpactScenarios';
import { GetProjectedAvailabilities } from './currentData/getProjectedAvailabilities';
import { GetProjectionsSummaryCardData } from './currentData/getProjectionsSummaryCardData';
import { GetProjectedFoodSourcesData } from './currentData/getProjectedFoodSources';
import { GetAgeGenderGroups } from './currentData/getAgeGenderGroups';

@Injectable()
export class ApiService extends BaseApi {
  private static readonly USE_LIVE_API = environment.useLiveApi;

  public readonly endpoints = {
    currentData: {
      getDataSources: new GetDataSources(ApiService.USE_LIVE_API),
      getSubRegionData: new GetSubRegionData(ApiService.USE_LIVE_API),
      getDietarySources: new GetDietarySources(false),
      getTopFood: new GetTopFood(ApiService.USE_LIVE_API),
      getHouseholdHistogramData: new GetHouseholdHistogramData(false),
      getMonthlyFoodGroups: new GetMonthlyFoodGroups(false),
      getProjectedAvailabilities: new GetProjectedAvailabilities(false),
      getProjectionsSummaryCardData: new GetProjectionsSummaryCardData(ApiService.USE_LIVE_API),
      getProjectedFoodSourcesData: new GetProjectedFoodSourcesData(ApiService.USE_LIVE_API),
      getAgeGenderGroups: new GetAgeGenderGroups(false),
    },
    misc: {
      getImpactScenarios: new GetImpactScenarios(true),
    },
  };

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, true).setDefaultParams({
      path: 'country',
      typeObj: CountryDictionaryItem,
    }),
    // .setMockObjects(CountryDictionaryItem.createMockItems(false)),
    new GetDictionary(DictionaryType.REGIONS, false)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(false, 0)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrient', typeObj: MicronutrientDictionaryItem })
      .setMockObjectsCreatorFunc((injector) => MicronutrientDictionaryItem.getMockItems(injector)),
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
