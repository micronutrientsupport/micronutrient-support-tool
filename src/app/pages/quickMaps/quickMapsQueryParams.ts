import { ActivatedRouteSnapshot } from '@angular/router';

export class QuickMapsQueryParams {
  public static readonly QUERY_PARAM_KEYS = {
    COUNTRY_ID: 'country-id',
    MICRONUTRIENT_IDS: 'mdn-ids',
  };

  public static getCountryId(route: ActivatedRouteSnapshot): string {
    return route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID);
  }

  public static getMicronutrientIds(route: ActivatedRouteSnapshot): Array<string> {
    const micronutrients = route.queryParamMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.MICRONUTRIENT_IDS);
    return ('string' !== typeof micronutrients)
      ? []
      : micronutrients.split(',')
        .map(item => item.toLowerCase().trim())
        .filter(item => ('' !== item));
  }

}
