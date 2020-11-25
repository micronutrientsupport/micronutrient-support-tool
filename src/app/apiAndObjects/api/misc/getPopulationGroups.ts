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
    params: GetPopulationGroupsParams,
  ): Promise<Array<PopulationGroup>> {
    return this.buildObjectsFromResponse(
      PopulationGroup,
      Promise.resolve(PopulationGroup.createMockItems(('0' === params.countryOrGroupId) ? 2 : 4)),
    );
  }
}

export interface GetPopulationGroupsParams {
  countryOrGroupId: string;
}
