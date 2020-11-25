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

@Injectable()
export class ApiService extends BaseApi<DictionaryType> {
  private readonly USE_LIVE_API = false;

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, true)
      .setDefaultParams({ path: 'country', typeObj: CountryDictionaryItem }),
    // .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.COUNTRIES)),
    new GetDictionary(DictionaryType.REGIONS, this.USE_LIVE_API)
      .setDefaultParams({ path: 'regions', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(20, DictionaryType.REGIONS)),
    new GetDictionary(DictionaryType.MICRONUTRIENTS, this.USE_LIVE_API)
      .setDefaultParams({ path: 'micronutrients', typeObj: MicronutrientDictionaryItem })
      .setMockObjects(MicronutrientDictionaryItem.createMockItems(30, DictionaryType.MICRONUTRIENTS)),
  ];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly currentData = {
    getMicronutrientDataOptions: new GetMicronutrientDataOptions(this.USE_LIVE_API),
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly misc = {
    getPopulationGroups: new GetPopulationGroups(this.USE_LIVE_API),
  };

  protected configure(): void {
    this.addDictionaries(this._dictionaries);

    this.addEndpoints(Object.values(this.currentData));
    this.addEndpoints(Object.values(this.misc));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
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
