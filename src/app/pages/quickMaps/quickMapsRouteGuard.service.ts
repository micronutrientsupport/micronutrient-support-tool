import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsQueryParams } from './quickMapsQueryParams';

/**
 * Service provided in app module as that's where the routing is controlled from.
 */
@Injectable()
export class QuickMapsRouteGuardService implements CanActivate {
  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    private router: Router,
    private currentDataService: CurrentDataService,
    injector: Injector,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const promises = new Array<Promise<boolean>>();
    // console.debug('canActivate', route, route.routeConfig.path);

    // code for potentially having different validity checks for different routes
    // switch (route.routeConfig.path) {
    //   case AppRoutes.QUICK_MAPS_BASELINE.segments:
    //   case AppRoutes.QUICK_MAPS_PROJECTION.segments:
    promises.push(this.validateParams());
    promises.push(this.validateParamsForRoute(route));

    // break;
    //   default:
    //     promises.push(Promise.resolve(true));
    // }
    return Promise.all(promises).then((valids: Array<boolean>) => {
      // console.debug('canActivate', valids);
      // if all are true, return true
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

  private validateParamsForRoute(route: ActivatedRouteSnapshot): Promise<boolean> {
    // TODO: ensure data level matches route
    return Promise.resolve(true);
  }

  private validateParams(): Promise<boolean> {

    return Promise.all([
      this.quickMapsParameters.getCountry(),
      this.quickMapsParameters.getMicronutrient(),
    ]).then((values: [
      CountryDictionaryItem,
      MicronutrientDictionaryItem,
    ]) => {
      const country = values.shift();
      const micronutrient = values.shift();
      const measure = this.quickMapsParameters.getMeasure();


      return (
        (null == country)
        || (null == micronutrient)
        || (null == measure)
      )
        ? false
        : this.currentDataService.getMicronutrientDataOptions(country, measure, true)
          .then((options: Array<MicronutrientDataOption>) => {
            const mndsDataId = this.quickMapsParameters.getMndsDataId();
            const dataLevel = this.quickMapsParameters.getDataLevel();

            let valid = false;
            const selectedOption = options.find(item => (item.id === mndsDataId));
            // while we're here, validate the data level if set
            if (null != selectedOption) {
              if (null == dataLevel) {
                valid = true;
              } else {
                const availableDataLevels = selectedOption.dataLevelOptions;
                valid = availableDataLevels.includes(dataLevel);
              }
            }

            return valid;
          });
    });

  }

}
