import { HttpClient } from '@angular/common/http';
import { MicronutrientDataOption } from '../../objects/micronutrientDataOption';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetMicronutrientDataOptions extends CacheableEndpoint<
Array<MicronutrientDataOption>,
GetMicronutrientDataOptionsParams,
MicronutrientDataOption
> {

  protected getCacheKey(params: GetMicronutrientDataOptionsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(): Promise<Array<MicronutrientDataOption>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  protected callMock(
    params: GetMicronutrientDataOptionsParams,
  ): Promise<Array<MicronutrientDataOption>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return this.buildObjectsFromResponse(
      MicronutrientDataOption,
      httpClient.get('/assets/exampleData/data-options-select.json').toPromise(),
    ).then(data => (params.singleOptionOnly) ? [data[Math.floor(Math.random() * data.length)]] : data);
  }
}

export interface GetMicronutrientDataOptionsParams {
  countryOrGroupId: string;
  micronutrientIds: Array<string>;
  populationGroupId: string;
  singleOptionOnly: boolean;
}
