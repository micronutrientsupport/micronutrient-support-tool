import { MicronutrientDataOption } from '../../objects/micronutrientDataOption';
import { RequestMethod } from '../../_lib_code/api/apiCaller';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';

export class GetMicronutrientDataOptions extends Endpoint<
Array<MicronutrientDataOption>,
GetMicronutrientDataOptionsParams,
MicronutrientDataOption
> {
  protected callLive(params: GetMicronutrientDataOptionsParams): Promise<Array<MicronutrientDataOption>> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(MicronutrientDataOption, callResponsePromise);
  }

  protected callMock(params: GetMicronutrientDataOptionsParams): Promise<Array<MicronutrientDataOption>> {
    return this.buildObjectsFromResponse(
      MicronutrientDataOption,
      Promise.resolve(MicronutrientDataOption.createMockItems(20)),
    );
  }
}

export interface GetMicronutrientDataOptionsParams {
  countryOrGroupId: string;
  micronutrientId: string;
  poulationGroupId: string;
}
