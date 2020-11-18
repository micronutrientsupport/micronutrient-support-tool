import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { BaseDictionaryItem } from '../_lib_code/objects/baseDictionaryItem';
import { MapsHttpResponseHandler } from './MapsHttpResponseHandler';
import { GetMicronutrientDataOptions } from './currentData/getMicroNutrientDataOptions';
import { MicronutrientDictionaryItem } from '../objects/dictionaries/micronutrientDictionaryItem';
import { CountryDictionaryItem } from '../objects/dictionaries/countryRegionDictionaryItem';

@Injectable()
export class ApiService extends BaseApi<DictionaryType> {
  private readonly USE_LIVE_API = false;

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, this.USE_LIVE_API)
      .setDefaultParams({ path: 'countries', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.COUNTRIES)),
    new GetDictionary(DictionaryType.REGIONS, this.USE_LIVE_API)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.REGIONS)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, this.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      .setMockObjects(MicronutrientDictionaryItem.createMockItems(30, DictionaryType.MICRONUTRIENTS)),
    new GetDictionary(DictionaryType.POPULATION_GROUPS, this.USE_LIVE_API)
      .setDefaultParams({ path: 'population-groups', typeObj: BaseDictionaryItem })
      .setMockObjects(BaseDictionaryItem.createMockItems(20, DictionaryType.POPULATION_GROUPS)),
  ];

  public readonly currentData = {
    getMicronutrientDataOptions: new GetMicronutrientDataOptions(this.USE_LIVE_API),
  };

  protected configure(): void {
    this.addDictionaries(this._dictionaries);

    this.addEndpoints(Object.values(this.currentData));
  }

  constructor(httpClient: HttpClient, injector: Injector) {
    super(injector, httpClient, new MapsHttpResponseHandler(injector), environment.apiBaseUrl);
    this.configure();

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
