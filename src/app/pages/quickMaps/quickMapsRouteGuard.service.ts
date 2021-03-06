/* eslint-disable @typescript-eslint/indent */
import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, ParamMap, Router, UrlTree } from '@angular/router';
import { CountryDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { MicronutrientMeasureType } from 'src/app/apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { DataSource } from 'src/app/apiAndObjects/objects/dataSource';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsQueryParams } from './quickMapsQueryParams';
import { AgeGenderGroup } from 'src/app/apiAndObjects/objects/ageGenderGroup';
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';

/**
 * Service provided in app module as that's where the routing is controlled from.
 */
@Injectable()
export class QuickMapsRouteGuardService implements CanActivate {
  private readonly quickMapsParameters: QuickMapsQueryParams;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentDataService: CurrentDataService,
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
    return (appRoute !== AppRoutes.QUICK_MAPS_PROJECTION
      ? Promise.resolve(null)
      : this.quickMapsParameters
        .getMicronutrient(snapshot.queryParamMap)
        .then((micronutrient: MicronutrientDictionaryItem) =>
          micronutrient.isInImpact ? null : AppRoutes.QUICK_MAPS_BASELINE,
        )) as Promise<AppRoute>;
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
    const measure = this.quickMapsParameters.getMeasure(snapshot.queryParamMap);
    // console.debug('validateMeasureForRoute', measure, snapshot);

    let navRoute: AppRoute; // route to navigate to
    if (MicronutrientMeasureType.DIET === measure && !appRoute.hasDescendent(AppRoutes.QUICK_MAPS_DIET)) {
      navRoute = AppRoutes.QUICK_MAPS_BASELINE;
    } else if (
      MicronutrientMeasureType.BIOMARKER === measure &&
      !appRoute.hasDescendent(AppRoutes.QUICK_MAPS_BIOMARKER)
    ) {
      navRoute = AppRoutes.QUICK_MAPS_BIOMARKER;
    }

    return Promise.resolve(navRoute);
  }

  private validateParamsConsistency(queryParamMap: ParamMap): Promise<boolean> {
    return Promise.all([
      this.quickMapsParameters.getCountry(queryParamMap),
      this.quickMapsParameters.getMicronutrient(queryParamMap),
    ]).then((values: [CountryDictionaryItem, MicronutrientDictionaryItem]) => {
      const country = values.shift() as CountryDictionaryItem;
      const micronutrient = values.shift() as MicronutrientDictionaryItem;
      const measure = this.quickMapsParameters.getMeasure(queryParamMap);
      const ageGenderGroupId = this.quickMapsParameters.getAgeGenderGroupId(queryParamMap);
      const dataLevel = this.quickMapsParameters.getDataLevel(queryParamMap);


      return null == country
        || null == micronutrient
        || null == measure
        ? false
        : this.getAgeGenderGroup(micronutrient, ageGenderGroupId)
          .then(ageGenderGroup => Promise.all([
            this.validateAgeGenderGroup(measure, ageGenderGroup),
            this.validateDataLevel(country, measure, ageGenderGroup, dataLevel),
          ])
            .then((valids: Array<boolean>) => valids.every((valid) => true === valid))
          );
    });
  }

  private validateDataLevel(
    country: CountryDictionaryItem,
    measure: MicronutrientMeasureType,
    ageGenderGroup: AgeGenderGroup,
    dataLevel: DataLevel,
  ): Promise<boolean> {
    return this.currentDataService.getDataSources(country, measure, ageGenderGroup, true)
      .then((options: Array<DataSource>) => {

        let valid = false;
        const selectedDataSource = options[0]; // always first item
        if (null != selectedDataSource) {
          valid = selectedDataSource.dataLevelOptions.includes(dataLevel);
        }

        return valid;
      });
  }

  private getAgeGenderGroup(
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroupId: string,
  ): Promise<AgeGenderGroup> {
    return this.currentDataService.getAgeGenderGroups([micronutrient])
      .then((ageGenderGroups: Array<AgeGenderGroup>) => ageGenderGroups.find((group) => group.id === ageGenderGroupId));
  }

  private validateAgeGenderGroup(
    measure: MicronutrientMeasureType,
    ageGenderGroup: AgeGenderGroup,
  ): Promise<boolean> {
    return Promise.resolve(
      (measure === MicronutrientMeasureType.DIET)
      || ((measure === MicronutrientMeasureType.BIOMARKER) && (null != ageGenderGroup))
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
