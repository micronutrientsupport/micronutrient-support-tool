import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { MapsHttpResponseHandler } from './mapsHttpResponseHandler';
import { GetMicronutrientDataOptions } from './currentData/getMicroNutrientDataOptions';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { CountryDictionaryItem } from '../objects/dictionaries/countryRegionDictionaryItem';
import { GetPopulationGroups } from './misc/getPopulationGroups';
import { GetSubRegionData } from './currentData/getSubRegionData';
import { Endpoint } from '../_lib_code/api/endpoint.abstract';
import { GetDietarySources } from './currentData/getDietarySources';
import { GetTopFood } from './currentData/getTopFood';
import { GetHouseholdHistogramData } from './currentData/getHouseholdHistogramData';
import { GetMonthlyFoodGroups } from './currentData/getMonthlyFoodGroups';

@Injectable()
export class ApiService extends BaseApi<DictionaryType> {
  private static readonly USE_LIVE_API = false;

  public readonly endpoints = {
    currentData: {
      getMicronutrientDataOptions: new GetMicronutrientDataOptions(ApiService.USE_LIVE_API),
      getSubRegionData: new GetSubRegionData(ApiService.USE_LIVE_API),
      getDietarySources: new GetDietarySources(ApiService.USE_LIVE_API),
      getTopFood: new GetTopFood(ApiService.USE_LIVE_API),
      getHouseholdHistogramData: new GetHouseholdHistogramData(ApiService.USE_LIVE_API),
      getMonthlyFoodGroups: new GetMonthlyFoodGroups(ApiService.USE_LIVE_API),
    },
    misc: {
      getPopulationGroups: new GetPopulationGroups(ApiService.USE_LIVE_API),
    },
  };

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, true).setDefaultParams({
      path: 'country',
      typeObj: CountryDictionaryItem,
    }),
    // .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.COUNTRIES)),
    new GetDictionary(DictionaryType.REGIONS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.REGIONS)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, ApiService.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      // .setMockObjects(MicronutrientDictionaryItem.createMockItems(30, DictionaryType.MICRONUTRIENTS)),
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
