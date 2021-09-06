import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { DataSource } from '../../objects/dataSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { AgeGenderGroup } from '../../objects/ageGenderGroup';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';

export class GetDataSources extends CacheableEndpoint<Array<DataSource>, GetDataSourcesParams, DataSource> {
  protected getCacheKey(params: GetDataSourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetDataSourcesParams): Promise<Array<DataSource>> {
    const callResponsePromise = this.apiCaller
      .doCall(['diet', 'data-source'], RequestMethod.GET, {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
      })
      .then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(DataSource, callResponsePromise);
  }

  protected callMock(params: GetDataSourcesParams): Promise<Array<DataSource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    const callResponsePromise = httpClient
      .get('/assets/exampleData/data-options-select.json')
      .toPromise()
      .then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(DataSource, callResponsePromise);
  }

  /**
   * Throws parameter validation errors for the developer
   * Logic written in the calling code should prevent these exceptions
   */
  protected validateParams(params: GetDataSourcesParams): void {
    // switch (true) {
    //   case (null == params.country): throw new Error('countryOrGroup parameter must be set');
    //   case (null == params.measureType): throw new Error('measureType parameter must be set');
    //   case ((params.measureType === MicronutrientMeasureType.BIOMARKER) && (null == params.ageGenderGroup)):
    //     throw new Error('ageGenderGroup parameter must be set when measureType is BIOMARKER');
    // }
  }

  private processResponseData(
    data: Array<Record<string, unknown>>,
    params: GetDataSourcesParams,
  ): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => (item.id = String(index).valueOf()));
    // return only first item when single option specified
    return true === params.singleOptionOnly ? data.slice(0, 1) : data;
  }
}

export interface GetDataSourcesParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  ageGenderGroup?: AgeGenderGroup;
  singleOptionOnly?: boolean;
}
