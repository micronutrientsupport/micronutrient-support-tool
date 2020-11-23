import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
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
        promises.push(this.isValidCountry(route));
        promises.push(this.isValidMicronutrients(route));
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

  private isValidDictionaryItems(dictType: DictionaryType, _itemIds: string | Array<string>): Promise<boolean> {
    const itemIds = (Array.isArray(_itemIds)) ? _itemIds : [_itemIds];
    return this.dictionaryService
      .getDictionary(dictType)
      .then((dict: Dictionary) => (dict.getItems(itemIds).length === itemIds.length));
  };

  private isValidCountry(route: ActivatedRouteSnapshot): Promise<boolean> {
    const country = QuickMapsQueryParams.getCountryId(route);
    // console.debug('isValidCountry', country, paramMap);
    return (null == country)
      ? Promise.resolve(false)
      : this.isValidDictionaryItems(DictionaryType.COUNTRIES, [country]);
  };
  private isValidMicronutrients(route: ActivatedRouteSnapshot): Promise<boolean> {
    const micronutrients = QuickMapsQueryParams.getMicronutrientIds(route);
    // console.debug('isValidCountry', country, paramMap);
    return (0 === micronutrients.length)
      ? Promise.resolve(false)
      : this.isValidDictionaryItems(DictionaryType.MICRONUTRIENTS, micronutrients);
  };

}
