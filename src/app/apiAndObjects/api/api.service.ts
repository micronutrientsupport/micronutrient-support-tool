import { Injectable, Injector } from '@angular/core';
import { MyHttpCallErrorHandler } from './myHttpCallErrorHandler';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DictionaryType } from './dictionaryType.enum';
import { BaseApi } from '../_lib_code/api/baseApi.abstract';
import { GetDictionary } from '../_lib_code/api/getDictionary';
import { BaseDictionaryItem } from '../_lib_code/objects/baseDictionaryItem';
import { CountryDictionaryItem } from '../objects/dictionaries/countryDictionaryItem';

@Injectable()
export class ApiService extends BaseApi<DictionaryType> {
  private readonly USE_LIVE_API = false;

  private _dictionaries = [
    new GetDictionary(DictionaryType.COUNTRIES, this.USE_LIVE_API)
      .setDefaultParams({ path: 'countries', typeObj: CountryDictionaryItem })
      .setMockObjects(CountryDictionaryItem.createMockItems(20)),
  ];

  // public readonly misc = {
  //   getActivityLogItems: new GetActivityLogItems(this.USE_LIVE_API),
  // };

  protected configure(): void {
    this.addDictionaries(this._dictionaries);

    // this.addEndpoints(Object.values(this.misc));
  }

  constructor(
    httpClient: HttpClient,
    injector: Injector,
  ) {
    super(
      injector,
      httpClient,
      new MyHttpCallErrorHandler(injector),
      environment.apiBaseUrl,
    );
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
