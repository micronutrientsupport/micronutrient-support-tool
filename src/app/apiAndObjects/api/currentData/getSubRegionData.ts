/* tslint:disable: no-string-literal */
import { CountryDictionaryItem } from '../../objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../../objects/dictionaries/micronutrientDictionaryItem';
import { DataLevel } from '../../objects/enums/dataLevel.enum';
import { DataSource } from '../../objects/dataSource';
import { SubRegionDataItem } from '../../objects/subRegionDataItem';
import { CacheableEndpoint } from '../../_lib_code/api/cacheableEndpoint.abstract';
import { RequestMethod } from '../../_lib_code/api/requestMethod.enum';

export class GetSubRegionData extends CacheableEndpoint<SubRegionDataItem, GetSubRegionDataParams> {

  protected getCacheKey(params: GetSubRegionDataParams): string {
    return JSON.stringify(params);
  }
  protected callLive(params: GetSubRegionDataParams): Promise<SubRegionDataItem> {
    const callResponsePromise = this.apiCaller.doCall([
      'diet',
      this.getDataLevelString(params.dataLevel),
      'geojson',
      params.countryOrGroup.id,
      params.micronutrient.id,
      params.mndsDataOption.compositionDataId,
      params.mndsDataOption.consumptionDataId,
    ], RequestMethod.GET,
    );

    return this.buildObjectFromResponse(SubRegionDataItem, callResponsePromise);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callMock(params?: GetSubRegionDataParams): Promise<SubRegionDataItem> {
    throw new Error('Method not implemented.');
  }
  // response format changed so commented out old mock code
  // protected callMock(): Promise<Array<SubRegionDataItem>> { // params: GetSubRegionDataParams,
  //   const httpClient = this.injector.get<HttpClient>(HttpClient);
  //   return this.buildObjectsFromResponse(
  //     SubRegionDataItem,
  //     // response after delay
  //     new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(httpClient.get('/assets/exampleData/sub-region-results_original.json').toPromise());
  //       }, 1500);
  //     }).then((data: Array<Record<string, unknown>>) => {
  //       if (null != data) {
  //         // find Karonga (north-east region) element and randonly change the display values so that the display changes a little
  //         // eslint-disable-next-line @typescript-eslint/dot-notation
  //         const element = data.find(item => item[SubRegionDataItem.KEYS.ID] === 8);
  //         if (null != element) {
  //           element[SubRegionDataItem.KEYS.MN_ABSOLUTE] = Math.floor(Math.random() * 1800);
  //           element[SubRegionDataItem.KEYS.MN_THRESHOLD] = Math.floor(Math.random() * 100);
  //         }
  //       }
  //       return data;
  //     }),
  //   );
  // }

  private getDataLevelString(dataLevel: DataLevel): string {
    switch (dataLevel) {
      case (DataLevel.COUNTRY): return 'country';
      case (DataLevel.HOUSEHOLD): return 'household';
    }
  }
}

export interface GetSubRegionDataParams {
  countryOrGroup: CountryDictionaryItem;
  micronutrient: MicronutrientDictionaryItem;
  mndsDataOption: DataSource;
  dataLevel: DataLevel;
}
