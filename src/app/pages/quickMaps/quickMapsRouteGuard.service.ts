import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { AppRoutes } from 'src/app/routes/routes';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

/**
 * Service provided in app module as that's where the routing is controlled from.
 */
@Injectable()
export class QuickMapsRouteGuardService implements CanActivate {
  constructor(
    private router: Router,
    private dictionaryService: DictionaryService,
    private miscApiService: MiscApiService,
  ) { }

  public canActivate(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const promises = new Array<Promise<boolean>>();
    // console.debug('canActivate', route, route.routeConfig.path);

    switch (route.routeConfig.path) {
      case AppRoutes.QUICK_MAPS_PROJECTION.segments:
        promises.push(this.isValidCountry(route));
        promises.push(this.isValidMicronutrients(route));
        promises.push(this.isValidPopGroup(route));
        break;
    }
    // eslint-disable-next-line arrow-body-style
    return Promise.all(promises).then((valids: Array<boolean>) => {
      if (valids.every((value) => value)) {
        return true;
      } else {
        // TODO: Show notification of "Params error"?

        // redirect to quickmaps map page
        // TODO: Consider redirect to params error page?
        return this.router.createUrlTree(AppRoutes.QUICK_MAPS.getRoute(), {
          queryParams: route.queryParams,
        });
      }
    });
  }

  private isValidDictionaryItems(dictType: DictionaryType, _itemIds: string | Array<string>): Promise<boolean> {
    const itemIds = Array.isArray(_itemIds) ? _itemIds : [_itemIds];
    return this.dictionaryService.getDictionary(dictType).then((dict: Dictionary) => {
      const items = dict.getItems(itemIds);
      // console.debug('isValidDictionaryItems', itemIds, items);

      return items.length === itemIds.length;
    });
  }

  private isValidCountry(route: ActivatedRouteSnapshot): Promise<boolean> {
    const country = QuickMapsQueryParams.getCountryId(route);
    // console.debug('isValidCountry', country, route.paramMap);
    return null == country ? Promise.resolve(false) : this.isValidDictionaryItems(DictionaryType.COUNTRIES, [country]);
  }

  private isValidMicronutrients(route: ActivatedRouteSnapshot): Promise<boolean> {
    const micronutrients = QuickMapsQueryParams.getMicronutrientIds(route);
    // console.debug('isValidMicronutrients', micronutrients, route.paramMap);
    return 0 === micronutrients.length
      ? Promise.resolve(false)
      : this.isValidDictionaryItems(DictionaryType.MICRONUTRIENTS, micronutrients);
  }

  private isValidPopGroup(route: ActivatedRouteSnapshot): Promise<boolean> {
    const popGroup = QuickMapsQueryParams.getPopGroupId(route);
    // console.debug('isValidCountry', country, route.paramMap);
    return (null == popGroup)
      ? Promise.resolve(false)
      : this.isValidCountry(route).then((validCountry: boolean) => (!validCountry)
        ? false
        : this.miscApiService.getPopulationGroups(QuickMapsQueryParams.getCountryId(route))
          .then((groups: Array<PopulationGroup>) => (null != groups.find(item => (item.id === popGroup))))
      );
  }
}
