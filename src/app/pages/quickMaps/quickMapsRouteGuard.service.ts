import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, ParamMap, Router, UrlTree } from '@angular/router';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { QuickMapsQueryParams } from './queryParams/quickMapsQueryParams';

/**
 * Service provided in app module as that's where the routing is controlled from.
 */
@Injectable()
export class QuickMapsRouteGuardService implements CanActivate {
  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    injector: Injector,
    private dialogService: DialogService,
  ) {
    this.quickMapsParameters = new QuickMapsQueryParams(injector);
  }

  public canActivate(
    snapshot: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const promises = new Array<Promise<boolean>>();
    // console.debug('canActivate', snapshot);

    // code for potentially having different validity checks for different routes
    // switch (route.routeConfig.path) {
    //   case AppRoutes.QUICK_MAPS_BASELINE.segments:
    //   case AppRoutes.QUICK_MAPS_PROJECTION.segments:
    promises.push(this.validateParamsConsistency(snapshot.queryParamMap));
    promises.push(this.validateMeasureForRoute(snapshot));
    promises.push(this.validateMicronutrientForRoute(snapshot));

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
        void this.dialogService.openInvalidParametersDialog();
        // redirect to quickmaps map page
        // TODO: Consider redirect to params error page?
        return this.router.createUrlTree(AppRoutes.QUICK_MAPS.getRoute(), {
          queryParams: snapshot.queryParams,
        });
      }
    });
  }

  public getRequiredNavRoute(): Promise<AppRoute> {
    const snapshot = this.getActivatedRouteSnapshot();
    return Promise.all([
      this.getRequiredNavForMeasureValidation(snapshot),
      this.getRequiredNavForMicronutrientValidation(snapshot),
    ]).then((navRoutes: Array<AppRoute>) => navRoutes.find((navRoute) => null != navRoute));
  }

  private validateMicronutrientForRoute(snapshot: ActivatedRouteSnapshot): Promise<boolean> {
    return this.getRequiredNavForMicronutrientValidation(snapshot).then((route) => null == route);
  }
  /**
   * validates selected micronutrient against current page.
   * and returns the route that should be navigated to, or null if valid.
   */
  private getRequiredNavForMicronutrientValidation(snapshot: ActivatedRouteSnapshot): Promise<AppRoute> {
    const appRoute = (snapshot.data as RouteData).appRoute;
    // don't allow diet projection page access if micronutrient not in IMPACT model
    return (
      appRoute !== AppRoutes.QUICK_MAPS_PROJECTION
        ? Promise.resolve(null)
        : this.quickMapsParameters
            .getMicronutrient(snapshot.queryParamMap)
            .then((micronutrient: MicronutrientDictionaryItem) =>
              micronutrient.isInImpact ? null : AppRoutes.QUICK_MAPS_BASELINE,
            )
    ) as Promise<AppRoute>;
  }

  private validateMeasureForRoute(snapshot: ActivatedRouteSnapshot): Promise<boolean> {
    return this.getRequiredNavForMeasureValidation(snapshot).then((route) => null == route);
  }
  /**
   * validates selected measure against current page.
   * and returns the route that should be navigated to, or null if valid.
   */
  private getRequiredNavForMeasureValidation(snapshot: ActivatedRouteSnapshot): Promise<AppRoute> {
    const appRoute = (snapshot.data as RouteData).appRoute;
    // console.debug('validateMeasureForRoute', measure, snapshot);

    return this.quickMapsParameters.getMeasure(snapshot.queryParamMap).then((measure) => {
      let navRoute: AppRoute; // route to navigate to
      if (MicronutrientMeasureType.DIET === measure && !appRoute.hasDescendent(AppRoutes.QUICK_MAPS_DIET)) {
        navRoute = AppRoutes.QUICK_MAPS_BASELINE;
      } else if (
        MicronutrientMeasureType.BIOMARKER === measure &&
        !appRoute.hasDescendent(AppRoutes.QUICK_MAPS_BIOMARKER)
      ) {
        navRoute = AppRoutes.QUICK_MAPS_BIOMARKER;
      }
      return navRoute;
    });
  }

  private validateParamsConsistency(queryParamMap: ParamMap): Promise<boolean> {
    return Promise.all([
      this.quickMapsParameters.getCountry(queryParamMap),
      this.quickMapsParameters.getMicronutrient(queryParamMap),
      this.quickMapsParameters.getAgeGenderGroup(queryParamMap),
      this.quickMapsParameters.getMeasure(queryParamMap),
    ]).then(
      (
        values: [CountryDictionaryItem, MicronutrientDictionaryItem, AgeGenderDictionaryItem, MicronutrientMeasureType],
      ) => {
        // console.debug('values', values);
        const country = values.shift() as CountryDictionaryItem;
        const micronutrient = values.shift() as MicronutrientDictionaryItem;
        const ageGenderGroup = values.shift() as AgeGenderDictionaryItem;
        const measure = values.shift() as MicronutrientMeasureType;

        return null == country || null == micronutrient || null == measure
          ? false
          : Promise.all([this.validateAgeGenderGroup(measure, ageGenderGroup)]).then((valids: Array<boolean>) =>
              valids.every((valid) => true === valid),
            );
      },
    );
  }

  private validateAgeGenderGroup(
    measure: MicronutrientMeasureType,
    ageGenderGroup: AgeGenderDictionaryItem,
  ): Promise<boolean> {
    return Promise.resolve(
      measure === MicronutrientMeasureType.DIET ||
        (measure === MicronutrientMeasureType.BIOMARKER && null != ageGenderGroup),
    );
  }

  private getActivatedRouteSnapshot(snapshot?: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    return null != snapshot ? snapshot : this.getActivatedRoute(this.route).snapshot;
  }
  private getActivatedRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getActivatedRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
