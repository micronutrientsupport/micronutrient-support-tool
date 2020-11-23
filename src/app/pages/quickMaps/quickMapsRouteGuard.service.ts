import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ParamMap, Router, UrlTree } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

/**
 * Service provided in app module as that's where the routing is controlled from.
 */
@Injectable()
export class QuickMapsRouteGuardService implements CanActivate {
  constructor(
    private router: Router,
    private dictionaryService: DictionaryService,
    private currentDataService: CurrentDataService,
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const promises = new Array<Promise<boolean>>();
    // console.debug('canActivate', route, route.routeConfig.path, AppRoutes.QUICK_MAPS_BASELINE.segments);

    switch (route.routeConfig.path) {
      case (AppRoutes.QUICK_MAPS_BASELINE.segments):
        promises.push(this.isValidCountry(route.queryParamMap));
        break;
    }
    // eslint-disable-next-line arrow-body-style
    return Promise.all(promises).then((valids: Array<boolean>) => {
      return (valids.every(value => value))
        ? true
        : this.router.createUrlTree( // redirect to quickmaps map page
          AppRoutes.QUICK_MAPS.getRoute(),
          {
            queryParams: route.queryParams,
          }
        );
    });
  }

  private isValidDictionaryItem(dictType: DictionaryType, itemId: string): Promise<boolean> {
    return this.dictionaryService
      .getDictionary(dictType)
      .then((dict: Dictionary) => (null != dict.getItem(itemId)));
  };

  private isValidCountry(paramMap: ParamMap): Promise<boolean> {
    const country = paramMap.get(QuickMapsQueryParams.QUERY_PARAM_KEYS.COUNTRY_ID);
    // console.debug('isValidCountry', country, paramMap);
    return (null == country)
      ? Promise.resolve(false)
      : this.isValidDictionaryItem(DictionaryType.COUNTRIES, country);
  };

}
