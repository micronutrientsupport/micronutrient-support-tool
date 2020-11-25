import { HttpClient } from '@angular/common/http';
import { PopulationGroup } from '../../objects/populationGroup';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
// import { RequestMethod } from '../../_lib_code/api/apiCaller';

export class GetPopulationGroups extends CacheableEndpoint<
Array<PopulationGroup>,
GetPopulationGroupsParams,
PopulationGroup
> {

  protected getCacheKey(params: GetPopulationGroupsParams): string {
    return params.countryOrGroupId;
  }
  protected callLive(): Promise<Array<PopulationGroup>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  protected callMock(
  ): Promise<Array<PopulationGroup>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      PopulationGroup,
      httpClient.get('/assets/exampleData/population-group-select.json').toPromise(),
    );
  }
}

export interface GetPopulationGroupsParams {
  countryOrGroupId: string;
}
