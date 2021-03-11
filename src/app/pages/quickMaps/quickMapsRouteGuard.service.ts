import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ParamMap, Router, UrlTree } from '@angular/router';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { MicronutrientDataOption } from 'src/app/apiAndObjects/objects/micronutrientDataOption';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
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
    // console.debug('canActivate', route.queryParamMap, route.routeConfig.path);

    // code for potentially having different validity checks for different routes
    // switch (route.routeConfig.path) {
    //   case AppRoutes.QUICK_MAPS_BASELINE.segments:
    //   case AppRoutes.QUICK_MAPS_PROJECTION.segments:
    promises.push(this.validateParams(route.queryParamMap));
    promises.push(this.validateMeasureForRoute(route));
    promises.push(this.validateMicronutrientForRoute(route));

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


  private validateMicronutrientForRoute(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.quickMapsParameters.getMicronutrient(route.queryParamMap)
      .then((micronutrient: MicronutrientDictionaryItem) => {
        const appRoute = (route.data as RouteData).appRoute;

        // don't allow diet projection page access if not in IMPACT model
        return (
          (appRoute !== AppRoutes.QUICK_MAPS_PROJECTION)
          || (appRoute === AppRoutes.QUICK_MAPS_PROJECTION) && (micronutrient.isInImpact));
      });
  }

  private validateMeasureForRoute(route: ActivatedRouteSnapshot): Promise<boolean> {
    const measure = this.quickMapsParameters.getMeasure(route.queryParamMap);

    const appRoute = (route.data as RouteData).appRoute;
    // console.debug('path', appRoute);
    const correctPage = (
      ((MicronutrientMeasureType.DIET === measure) && appRoute.hasDescendent(AppRoutes.QUICK_MAPS_DIET))
      || ((MicronutrientMeasureType.BIOMARKER === measure) && appRoute.hasDescendent(AppRoutes.QUICK_MAPS_BIOMARKER))
    );

    return Promise.resolve(correctPage);
  }

  private validateParams(queryParamMap: ParamMap): Promise<boolean> {

    return Promise.all([
      this.quickMapsParameters.getCountry(queryParamMap),
      this.quickMapsParameters.getMicronutrient(queryParamMap),
    ]).then((values: [
      CountryDictionaryItem,
      MicronutrientDictionaryItem,
    ]) => {
      const country = values.shift() as CountryDictionaryItem;
      const micronutrient = values.shift() as MicronutrientDictionaryItem;
      const measure = this.quickMapsParameters.getMeasure(queryParamMap);

      return (
        (null == country)
        || (null == micronutrient)
        || (null == measure)
      )
        ? false
        : this.currentDataService.getMicronutrientDataOptions(country, measure, true)
          .then((options: Array<MicronutrientDataOption>) => {
            const dataLevel = this.quickMapsParameters.getDataLevel(queryParamMap);

            let valid = false;
            const selectedOption = options[0]; // first item
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
