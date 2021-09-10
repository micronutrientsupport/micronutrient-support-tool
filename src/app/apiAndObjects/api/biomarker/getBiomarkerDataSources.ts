import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { AgeGenderDictionaryItem } from '../../objects/dictionaries/ageGenderDictionaryItem';
import { BiomarkerDataSource } from '../../objects/biomarkerDataSource';

export class GetBiomarkerDataSources extends CacheableEndpoint<
  Array<BiomarkerDataSource>,
  GetBiomarkerDataSourcesParams,
  BiomarkerDataSource
> {
  protected getCacheKey(params: GetBiomarkerDataSourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetBiomarkerDataSourcesParams): Promise<Array<BiomarkerDataSource>> {
    const callResponsePromise = this.apiCaller
      .doCall(['biomarker', 'data-sources'], RequestMethod.GET, {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
        // ageGenderGroup: params.ageGenderGroup,
      })
      .then((data: Array<Record<string, unknown>>) => this.processResponseData(data, params));

    return this.buildObjectsFromResponse(BiomarkerDataSource, callResponsePromise);
  }

  protected callMock(): Promise<BiomarkerDataSource[]> {
    throw new Error('Method not implemented.');
  }

  private processResponseData(
    data: Array<Record<string, unknown>>,
    params: GetBiomarkerDataSourcesParams,
  ): Array<Record<string, unknown>> {
    data.forEach((item: Record<string, unknown>, index: number) => (item.id = String(index).valueOf()));
    // return only first item when single option specified
    return true === params.singleOptionOnly ? data.slice(0, 1) : data;
  }
}

export interface GetBiomarkerDataSourcesParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  ageGenderGroup: AgeGenderDictionaryItem;
  singleOptionOnly?: boolean;
}
