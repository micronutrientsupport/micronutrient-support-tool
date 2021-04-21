import { HttpClient } from '@angular/common/http';
import { AgeGenderGroup } from '../../objects/ageGenderGroup';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';

export class GetAgeGenderGroups extends CacheableEndpoint<
  Array<AgeGenderGroup>,
  GetAgeGenderGroupsParams,
  AgeGenderGroup
> {

  protected getCacheKey(params: GetAgeGenderGroupsParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
  // params: GetAgeGenderGroupsParams,
  ): Promise<Array<AgeGenderGroup>> {
    throw new Error('Method not implemented.');
  }

  protected callMock(
  ): Promise<Array<AgeGenderGroup>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    const callResponsePromise = httpClient.get('/assets/exampleData/age-gender-groups.json').toPromise();

    return this.buildObjectsFromResponse(AgeGenderGroup, callResponsePromise);
  }

}

export interface GetAgeGenderGroupsParams {
  micronutrients: Array<MicronutrientDictionaryItem>;
}
