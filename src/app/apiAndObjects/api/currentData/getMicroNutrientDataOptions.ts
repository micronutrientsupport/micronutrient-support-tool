import { HttpClient } from '@angular/common/http';
import { MicronutrientMeasureType } from '../../objects/enums/micronutrientMeasureType.enum';
import { MicronutrientDataOption } from '../../objects/micronutrientDataOption';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetMicronutrientDataOptions extends CacheableEndpoint<
  Array<MicronutrientDataOption>,
  GetMicronutrientDataOptionsParams,
  MicronutrientDataOption
  > {

  protected getCacheKey(params: GetMicronutrientDataOptionsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
    params: GetMicronutrientDataOptionsParams,
  ): Promise<Array<MicronutrientDataOption>> {
    const callResponsePromise = this.apiCaller.doCall(['data-source', params.countryOrGroupId, params.measureType],
      RequestMethod.GET,
    ).then((data: Array<Record<string, unknown>>) => {
      // returned options don't have ids, so set one here to help internally
      data.forEach((item: Record<string, unknown>, index: number) => item.id = String(index).valueOf());
      return data;
    });

    return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  protected callMock(
    params: GetMicronutrientDataOptionsParams,
  ): Promise<Array<MicronutrientDataOption>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return only first item when single option specified
    return this.buildObjectsFromResponse(
      MicronutrientDataOption,
      httpClient.get('/assets/exampleData/data-options-select.json').toPromise(),
    ).then(data => (params.singleOptionOnly) ? data.slice(0, 1) : data);
  }
}

export interface GetMicronutrientDataOptionsParams {
  countryOrGroupId: string;
  measureType: MicronutrientMeasureType;
  singleOptionOnly: boolean;
}
