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
  subsKeys: [] as Array<string>,
  getRoute(): Array<string> {
    return getRoute(this);
  },
};

export class AppRoutes {
  public static readonly HOME = {
    ...BASE_ROUTE,
    segments: '',
  };
  public static readonly MAPS_TOOL = {
    ...BASE_ROUTE,
    segments: 'maps-tool',
  };
  public static readonly QUICK_MAPS = {
    ...BASE_ROUTE,
    segments: 'quick-maps',
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
  public static readonly QUICK_MAPS_BASELINE = {
    ...BASE_ROUTE,
    segments: 'diet/baseline',
    parent: AppRoutes.QUICK_MAPS,
  };
  public static readonly QUICK_MAPS_PROJECTION = {
    ...BASE_ROUTE,
    segments: 'diet/projection',
    parent: AppRoutes.QUICK_MAPS,
  };
  public static readonly QUICK_MAPS_BIOMARKER = {
    ...BASE_ROUTE,
    segments: 'biomarker',
    parent: AppRoutes.QUICK_MAPS,
  };
  // *** quick maps end ***
}

export interface AppRoute {
  readonly segments: string;
  readonly parent?: AppRoute;
  readonly subsKeys: Array<string>;
  getRoute(): Array<string>;
  getSegments(): Array<string>;
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
