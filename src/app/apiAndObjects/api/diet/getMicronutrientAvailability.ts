/* tslint:disable: no-string-literal */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../../objects/dietDataSource';
import { DataLevel } from '../../objects/enums/dataLevel.enum';
import { MnAvailibiltyCountryItem } from '../../objects/mnAvailibilityCountryItem';
import { MnAvailibiltyHouseholdItem } from '../../objects/mnAvailibilityHouseholdItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

type OBJECT_TYPE = MnAvailibiltyCountryItem | MnAvailibiltyHouseholdItem;

export class GetMicronutrientAvailability extends CacheableEndpoint<
  Array<OBJECT_TYPE>,
  GetMicronutrientAvailabilityParams,
  OBJECT_TYPE
> {
  protected getCacheKey(params: GetMicronutrientAvailabilityParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetMicronutrientAvailabilityParams): Promise<Array<OBJECT_TYPE>> {
    const callResponsePromise = this.apiCaller.doCall(
      ['diet', this.getDataLevelSegment(params.dataSource), 'availability'],
      RequestMethod.GET,
      {
        countryId: params.country.id,
        micronutrientId: params.micronutrient.id,
        compositionDataId: params.dataSource.compositionDataId,
        consumptionDataId: params.dataSource.consumptionDataId,
      },
      null,
      (headers: HttpHeaders) => (params.asGeoJson ? headers.set('Accept', 'application/geo-json') : headers),
    );

    return this.buildObjectsFromResponse(this.getObjectType(params.dataSource), callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetMicronutrientAvailabilityParams): Promise<Array<OBJECT_TYPE>> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectsFromResponse(
      this.getObjectType(params.dataSource),
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/mn_availability.json').toPromise());
        }, 1500);
      }),
    );
  }

  private getObjectType(
    dietDataSource: DietDataSource,
  ): typeof MnAvailibiltyCountryItem | typeof MnAvailibiltyHouseholdItem {
    switch (dietDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return MnAvailibiltyCountryItem;
      case DataLevel.HOUSEHOLD:
        return MnAvailibiltyHouseholdItem;
    }
  }
  private getDataLevelSegment(dietDataSource: DietDataSource): string {
    switch (dietDataSource.dataLevel) {
      case DataLevel.COUNTRY:
        return 'country';
      case DataLevel.HOUSEHOLD:
        return 'household';
    }
  }
}

export interface GetMicronutrientAvailabilityParams {
  country: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  dataSource: DietDataSource;
  asGeoJson: boolean;
}
