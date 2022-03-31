import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, UrlTree } from '@angular/router';
import { FeatureFlagsService } from '../services/featureFlags.service';

@Injectable({ providedIn: 'root' })
export class FeatureFlagGuard implements CanActivate, CanLoad {
  constructor(private featureFlagsService: FeatureFlagsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    console.log(`Checking ${route.data.featureFlag} flag before activating route`);
    const flagIsEnabled = this.featureFlagsService.isEnabled(route.data.featureFlag);
    // console.log(`State: ${flagIsEnabled}`);
    if (!flagIsEnabled) {
      return this.router.parseUrl('/');
    } else {
      return flagIsEnabled;
    }
  }

  canLoad(route: Route): boolean | UrlTree {
    console.log(`Checking ${route.data.featureFlag} flag before loading route`);
    const flagIsEnabled = this.featureFlagsService.isEnabled(route.data.featureFlag);
    // console.log(`State: ${flagIsEnabled}`);
    if (!flagIsEnabled) {
      return this.router.parseUrl('/');
    } else {
      return flagIsEnabled;
    }
  }
}
