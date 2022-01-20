/*
 example route with variables

  public static readonly TEST = {
    ...BASE_ROUTE,
    subsKeys: ['id1', 'id2'],
    segments: 'test/:id1/:id2',
    parent: AppRoutes.TEST_PARENT,
    getRoute(id1: string, id2: string): Array<string> {
      return getRoute(this, [id1, id2]);
    },
  };

 get route in ts: AppRoutes.QUICK_MAPS_BASELINE.getRoute('11', '12')
 get route in template: <a [routerLink]="ROUTES.TEST | route: [13,14]">TEST</a>
 */

const BASE_ROUTE = {
  parent: null,
  subsKeys: [] as Array<string>,
  routerRoot: false,
  getRoute(): Array<string> {
    return getRoute(this);
  },
  getRouterPath(): string {
    return getRouterPath(this);
  },
  getDescendents(): Array<AppRoute> {
    return getDescendents(this);
  },
  hasDescendent(parentRoute: AppRoute): boolean {
    return hasDescendent(this, parentRoute);
  },
};

export class AppRoutes {
  public static readonly HOME = {
    ...BASE_ROUTE,
    segments: '',
    routerRoot: true,
  };
  public static readonly MAPS_TOOL = {
    ...BASE_ROUTE,
    segments: 'maps-tool',
  };
  public static readonly QUICK_MAPS = {
    ...BASE_ROUTE,
    segments: 'quick-maps',
    routerRoot: true,
  };
  public static readonly EDUCATIONAL_RESOURCES = {
    ...BASE_ROUTE,
    segments: 'educational-resources',
  };
  public static readonly HELP = {
    ...BASE_ROUTE,
    segments: 'help',
  };
  public static readonly PROJECT_OBJECTIVES = {
    ...BASE_ROUTE,
    segments: 'project-objectives',
  };
  public static readonly STYLE_GUIDE = {
    ...BASE_ROUTE,
    segments: 'style-guide',
  };

  // *** quick maps start ***
  // used in quick maps sub-router
  public static readonly QUICK_MAPS_LOCATION_SELECT = {
    ...BASE_ROUTE,
    segments: '',
    parent: AppRoutes.QUICK_MAPS,
  };
  public static readonly QUICK_MAPS_NO_RESULTS = {
    ...BASE_ROUTE,
    segments: 'noResults',
    parent: AppRoutes.QUICK_MAPS,
  };
  public static readonly QUICK_MAPS_DIET = {
    ...BASE_ROUTE,
    segments: 'diet',
    parent: AppRoutes.QUICK_MAPS,
  };
  public static readonly QUICK_MAPS_BASELINE = {
    ...BASE_ROUTE,
    segments: 'baseline',
    parent: AppRoutes.QUICK_MAPS_DIET,
  };
  public static readonly QUICK_MAPS_PROJECTION = {
    ...BASE_ROUTE,
    segments: 'projection',
    parent: AppRoutes.QUICK_MAPS_DIET,
  };
  public static readonly QUICK_MAPS_DIETARY_CHANGE = {
    ...BASE_ROUTE,
    segments: 'dietary-change',
    parent: AppRoutes.QUICK_MAPS_DIET,
  };
  public static readonly QUICK_MAPS_COST_EFFECTIVENESS = {
    ...BASE_ROUTE,
    segments: 'cost-effectiveness',
    parent: AppRoutes.QUICK_MAPS_DIET,
  };
  public static readonly QUICK_MAPS_BIOMARKER = {
    ...BASE_ROUTE,
    segments: 'biomarker',
    parent: AppRoutes.QUICK_MAPS,
  };
  // *** quick maps end ***

  // used in intervention review sub-router
  public static readonly INTERVENTION_REVIEW = {
    ...BASE_ROUTE,
    segments: 'intervention-review',
    // parent: AppRoutes.QUICK_MAPS_COST_EFFECTIVENESS,
    routerRoot: true,
  };
  public static readonly INTERVENTION_REVIEW_BASELINE = {
    ...BASE_ROUTE,
    segments: '',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW = {
    ...BASE_ROUTE,
    segments: 'intervention-assumptions-review',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_COMPLIANCE = {
    ...BASE_ROUTE,
    segments: 'intervention-compliance',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_COST_SUMMARY = {
    ...BASE_ROUTE,
    segments: 'intervention-cost-summary',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_INDUSTRY_INFORMATION = {
    ...BASE_ROUTE,
    segments: 'intervention-industry-information',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_MONITORING_INFORMATION = {
    ...BASE_ROUTE,
    segments: 'intervention-monitoring-information',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_RECURRING_COSTS = {
    ...BASE_ROUTE,
    segments: 'intervention-recurring-costs',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
  public static readonly INTERVENTION_REVIEW_STARTUP_SCALEUP_COSTS = {
    ...BASE_ROUTE,
    segments: 'intervention-startup-scaleup-costs',
    parent: AppRoutes.INTERVENTION_REVIEW,
  };
}

export interface AppRoute {
  readonly segments: string;
  readonly parent?: AppRoute;
  readonly subsKeys: Array<string>;
  readonly routerRoot: boolean;
  getRoute(): Array<string>;
  getDescendents(): Array<AppRoute>;
  hasDescendent(parentRoute: AppRoute): boolean;
}

/**
 * @param route an AppRoute object
 * @param subsValues array of values that correspond to AppRoute subsKeys and will replace placeholders in route
 * e.g.
 * route.parent.getRoute() = ['segment1/segment2']
 * route.segments = 'segment3/:id1/segment4/:id2'
 * route.subsKeys = ['id1', 'id2']
 * subsValues = ['11', '12']
 * result is: ['/segment1/segment2/segment3/11/segment4/12']
 */
export const getRoute = (route: AppRoute, subsValues?: Array<string>): Array<string> => {
  let url = null != route.parent ? route.parent.getRoute()[0] : '';
  url = '/' + url + '/' + route.segments;
  url = url.replace(/\/+/g, '/'); // replace multiple '/'
  if (null != subsValues) {
    route.subsKeys.forEach((key: string, i: number) => {
      const value = subsValues[i];
      if (null != value) {
        url = url.replace(`:${key}`, value);
      }
    });
  }
  return [url];
};

export const getRouterPath = (route: AppRoute): string => {
  const pathSegments = new Array<string>();
  // always first route
  pathSegments.push(route.segments);
  // stop if parent is null or parent is the root of a (sub)router
  while (null != route.parent && !route.parent.routerRoot) {
    pathSegments.push(route.parent.segments);
    route = route.parent;
  }
  return pathSegments.reverse().join('/');
};

export const getDescendents = (route: AppRoute): Array<AppRoute> => {
  const descendents = new Array<AppRoute>();
  while (null != route) {
    descendents.push(route);
    route = route.parent;
  }
  return descendents;
};

export const hasDescendent = (route: AppRoute, parentTest: AppRoute): boolean =>
  route.getDescendents().includes(parentTest);

// Needs work
// export const routeFromPath = (path: string): AppRoute => {
//   const routeKey = Object.keys(AppRoutes).find((key: string) => {
//     const appRoutePath = (AppRoutes[key] as AppRoute).getRoute().join('/');
//     console.debug('routeFromPath', path, appRoutePath);
//     return (appRoutePath === path);
//   });
//   return AppRoutes[routeKey];
// };
