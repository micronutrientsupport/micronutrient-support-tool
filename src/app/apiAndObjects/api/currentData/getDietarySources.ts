import { HttpClient } from '@angular/common/http';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../../objects/dietarySource';
import { MicronutrientDataOption } from '../../objects/micronutrientDataOption';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';

export class GetDietarySources extends CacheableEndpoint<
Array<DietarySource>,
GetDietarySourcesParams,
DietarySource
> {

  protected getCacheKey(params: GetDietarySourcesParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
  // params: GetDietarySourcesParams,
  ): Promise<Array<DietarySource>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(DietarySource, callResponsePromise);
  }

  protected callMock(
  // params: GetDietarySourcesParams,
  ): Promise<Array<DietarySource>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    // return a single random element when specified
    return this.buildObjectsFromResponse(
      DietarySource,
      httpClient.get('/assets/exampleData/dietary_sources.json').toPromise(),
    );
  }
}

export interface GetDietarySourcesParams {
  countryOrGroupId: string;
  micronutrients: Array<MicronutrientDictionaryItem>;
  mndsDataOption: MicronutrientDataOption,
}
