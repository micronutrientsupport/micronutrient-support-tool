import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { Region } from '../../objects/region';

export class GetRegions extends CacheableEndpoint<Array<Region>, GetRegionsParams, Region> {
  protected getCacheKey(params: GetRegionsParams): string {
    return JSON.stringify(params);
  }

  protected callLive(params: GetRegionsParams): Promise<Region[]> {
    const callResponsePromise = this.apiCaller.doCall([`countries/${params.countryId}/regions`], RequestMethod.GET);
    return this.buildObjectsFromResponse(Region, callResponsePromise);
  }

  protected callMock(): Promise<Region[]> {
    return null;
  }
}

export interface GetRegionsParams {
  countryId: string;
}
