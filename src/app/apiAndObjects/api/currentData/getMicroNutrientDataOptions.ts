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
      this.addIdtoData(data);
      // return only first item when single option specified
      return (params.singleOptionOnly) ? data.slice(0, 1) : data;
    });

    return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  protected callMock(
    params: GetMicronutrientDataOptionsParams,
  ): Promise<Array<MicronutrientDataOption>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    const callResponsePromise = httpClient.get('/assets/exampleData/data-options-select.json').toPromise()
      .then((data: Array<Record<string, unknown>>) => {
        this.addIdtoData(data);
        // return only first item when single option specified
        return (params.singleOptionOnly) ? data.slice(0, 1) : data;
      });

    return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  private addIdtoData(data: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => item.id = String(index).valueOf());
    return data;
  }
}

export interface GetMicronutrientDataOptionsParams {
  countryOrGroupId: string;
  measureType: MicronutrientMeasureType;
  singleOptionOnly: boolean;
}
