import { HttpClient } from '@angular/common/http';
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { HouseholdHistogramData } from '../../objects/householdHistogramData';
import { DataSource } from '../../objects/dataSource';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';

export class GetHouseholdHistogramData extends CacheableEndpoint<
  HouseholdHistogramData,
  GetHouseholdHistogramDataParams
> {

  protected getCacheKey(params: GetHouseholdHistogramDataParams): string {
    return JSON.stringify(params);
  }
  protected callLive(
    // params: GetHouseholdHistogramDataParams,
  ): Promise<HouseholdHistogramData> {
    throw new Error('Method not implemented.');
    // const callResponsePromise = this.apiCaller.doCall('', RequestMethod.GET, {
    //   'country-or-group-id': params.countryOrGroupId,
    //   'micronutrient-id': params.micronutrientId,
    //   'poulationGroup-id': params.poulationGroupId,
    // });

    // return this.buildObjectsFromResponse(HouseholdHistogramData, callResponsePromise);
  }

  protected callMock(
    // params: GetHouseholdHistogramDataParams,
  ): Promise<HouseholdHistogramData> {
    const httpClient = this.injector.get<HttpClient>(HttpClient);
    return this.buildObjectFromResponse(
      HouseholdHistogramData,
      // response after delay
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(httpClient.get('/assets/exampleData/household_histogram.json').toPromise());
        }, 1500);
      }),
    ).then((data: HouseholdHistogramData) => {
      if (null != data.data[0]) {
        // change something so that the display changes a little
        data.data[0].frequency = Math.floor(Math.random() * data.adequacyThreshold);
      }
      return data;
    });
  }
}

export interface GetHouseholdHistogramDataParams {
  countryOrGroup: CountryDictionaryItem;
  micronutrients: Array<MicronutrientDictionaryItem>;
  mndsDataOption: DataSource;
}
