import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { EnumTools } from 'src/utility/enumTools';

export class QuickMapsQueryParams {
  public static readonly QUERY_PARAM_KEYS = {
    COUNTRY_ID: 'country-id',
    MICRONUTRIENT_ID: 'mnd-id',
    MICRONUTRIENT_DATASET: 'dataset-id',
    DATA_LEVEL: 'data-level',
  };

  public static getCountryId(route: ActivatedRouteSnapshot): string {
    return route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID);
  }

  public static getMicronutrientId(route: ActivatedRouteSnapshot): string {
    return route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_ID);
  }

  public static getMndsDataId(route: ActivatedRouteSnapshot): string {
    return route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_DATASET);
  }

  public static getDataLevel(route: ActivatedRouteSnapshot): DataLevel {
    const value = route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.DATA_LEVEL);
    return EnumTools.getEnumFromValue<DataLevel>(value, DataLevel);
  }

  public static setQueryParams(router: Router, activatedRoute: ActivatedRoute, params: Record<string, string | Array<string>>): void {
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
    void router.navigate(
      [],
      {
        relativeTo: activatedRoute,
        replaceUrl: true, // replace in history
        queryParams: stringParams,
        // queryParamsHandling: 'merge', // merges with what's already there, but unused params are removed
      }
    );
  }


  public static arrayValuesSame(array1: Array<string>, array2: Array<string>): boolean {
    array1 = this.filterAndSortArray(array1);
    array2 = this.filterAndSortArray(array2);

    return (
      (array1.length === array2.length)
      && (array1.every((item: string, index: number) => (index === array2.indexOf(item))))
    );
  }

  public static filterAndSortArray(array: Array<string>): Array<string> {
    array = (null == array) ? [] : array.slice(); // copy;
    return array
      .map((item: string) => item.trim()) // trim
      .filter((item: string) => (item.length > 0)) // remove empty values
      .filter((item: string, index: number, thisArray: Array<string>) => (thisArray.indexOf(item) === index)) // remove duplicates
      .sort();
  }

}
