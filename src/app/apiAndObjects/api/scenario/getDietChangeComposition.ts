import { CompositionChangeItem } from '../../objects/dietaryChange.item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoint } from '../../_lib_code/api/endpoint.abstract';
import { DietDataSource } from '../../objects/dietDataSource';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { MnAvailabilityEndpointHelper, MN_AVAILABILITY_TYPE } from '../diet/mnAvailabilityEndpointHelper';
import { MnAvailibiltyItem } from '../../objects/mnAvailibilityItem.abstract';

export class GetDietChangeComposition extends Endpoint<
  Array<MN_AVAILABILITY_TYPE>,
  GetDietChangeCompositionParams,
  MN_AVAILABILITY_TYPE
> {
  protected callLive(params: GetDietChangeCompositionParams): Promise<Array<MN_AVAILABILITY_TYPE>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', MnAvailabilityEndpointHelper.getDataLevelSegment(params.dataSource), 'scenario', 'composition'],
      RequestMethod.POST,
      null,
      {
        consumptionDataId: Number(params.dataSource.consumptionDataId),
        compositionDataId: Number(params.dataSource.compositionDataId),
        micronutrientId: params.micronutrient.id,
        foodGenusIds: params.changeItems.map((item) => item.foodItem.id),
        replacementCompositionValues: params.changeItems.map((item) => item.scenarioValue),
      },
      (headers: HttpHeaders) => (true === params.asGeoJson ? headers.set('Accept', 'application/geo-json') : headers),
    );

    return this.buildObjectsFromResponse(
      MnAvailabilityEndpointHelper.getObjectType(params.dataSource),
      callResponsePromise,
    );
  }

  protected callMock(params: GetDietChangeCompositionParams): Promise<Array<MN_AVAILABILITY_TYPE>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      MnAvailabilityEndpointHelper.getObjectType(params.dataSource),
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            httpClient
              .get('/assets/exampleData/mn_availability.json')
              .toPromise()
              .then((objects: Array<Record<string, unknown>>) => {
                objects.forEach((obj) => {
                  // change something so that the display changes a little (multiply by 0.8 to 0.9)
                  (obj[MnAvailibiltyItem.KEYS.DEFICIENT_VALUE] as number) *= Math.random() * 0.1 + 0.8;
                  (obj[MnAvailibiltyItem.KEYS.DEFICIENT_PERC] as number) *= Math.random() * 0.1 + 0.8;
                });
                return objects;
              }),
          );
        }, 1500);
      }),
    );
  }
}

export interface GetDietChangeCompositionParams {
  dataSource: DietDataSource;
  micronutrient: MicronutrientDictionaryItem;
  changeItems: Array<CompositionChangeItem>;
  asGeoJson?: boolean;
}
