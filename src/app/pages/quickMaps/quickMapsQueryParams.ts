import { Injector } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { EnumTools } from 'src/utility/enumTools';

export class QuickMapsQueryParams {
  public static readonly QUERY_PARAM_KEYS = {
    COUNTRY_ID: 'country-id',
    MICRONUTRIENT_ID: 'mnd-id',
    MEASURE: 'measure',
    DATA_LEVEL: 'data-level',
  };

  private readonly dictionariesService: DictionaryService;
  private readonly router: Router;
  private readonly route: ActivatedRoute;

  constructor(injector: Injector) {
    this.dictionariesService = injector.get<DictionaryService>(DictionaryService);
    this.router = injector.get<Router>(Router);
    this.route = injector.get<ActivatedRoute>(ActivatedRoute);
  }

  public getCountryId(queryParamMap?: ParamMap): string {
    return this.params(queryParamMap).get(QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID);
  }
  public getCountry(queryParamMap?: ParamMap): Promise<CountryDictionaryItem> {
    return this.dictionariesService.getDictionary(DictionaryType.COUNTRIES)
      .then(dict => dict.getItem(this.getCountryId(queryParamMap)));
  }

  public getMicronutrientId(queryParamMap?: ParamMap): string {
    return this.params(queryParamMap).get(QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID);
  }
  public getMicronutrient(queryParamMap?: ParamMap): Promise<MicronutrientDictionaryItem> {
    return this.dictionariesService.getDictionary(DictionaryType.MICRONUTRIENTS)
      .then(dict => dict.getItem(this.getMicronutrientId(queryParamMap)));
  }

  public getMeasure(queryParamMap?: ParamMap): MicronutrientMeasureType {
    return EnumTools.getEnumFromValue(
      this.params(queryParamMap).get(QuickMapsQueryParams.QUERY_PARAM_KEYS.MEASURE),
      MicronutrientMeasureType,
    );
  }

  public getDataLevel(queryParamMap?: ParamMap): DataLevel {
    return EnumTools.getEnumFromValue(
      this.params(queryParamMap).get(QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL),
      DataLevel,
    );
  }
  public setQueryParams(params: Record<string, string | Array<string>>): void {
    // console.debug('setQueryParams', params);
    const stringParams: Record<string, string> = {};
    // convert Array values to strings
    Object.keys(params).forEach((key: string) => {
      if (null != params[key]) {
        if (Array.isArray(params[key])) {
          params[key] = (params[key] as Array<string>).join(',');
        }
        const trimmedValue = (null == params[key]) ? '' : (params[key] as string).trim();
        if (trimmedValue.length > 0) {
          stringParams[key] = trimmedValue;
        }
      }
    });
    void this.router.navigate(
      [],
      {
        relativeTo: this.route,
        replaceUrl: true, // replace in history
        queryParams: stringParams,
        // queryParamsHandling: 'merge', // merges with what's already there, but unused params are removed
      }
    );
  }


  // public static arrayValuesSame(array1: Array<string>, array2: Array<string>): boolean {
  //   array1 = this.filterAndSortArray(array1);
  //   array2 = this.filterAndSortArray(array2);

  //   return (
  //     (array1.length === array2.length)
  //     && (array1.every((item: string, index: number) => (index === array2.indexOf(item))))
  //   );
  // }

  // public static filterAndSortArray(array: Array<string>): Array<string> {
  //   array = (null == array) ? [] : array.slice(); // copy;
  //   return array
  //     .map((item: string) => item.trim()) // trim
  //     .filter((item: string) => (item.length > 0)) // remove empty values
  //     .filter((item: string, index: number, thisArray: Array<string>) => (thisArray.indexOf(item) === index)) // remove duplicates
  //     .sort();
  // }

  private params(queryParamMap?: ParamMap): ParamMap {
    // console.debug('this.route.snapshot.queryParamMap', this.route.snapshot);
    return (null != queryParamMap) ? queryParamMap : this.route.snapshot.queryParamMap;
  }
}
