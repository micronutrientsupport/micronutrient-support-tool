
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
    segments: 'location',
    parent: AppRoutes.QUICK_MAPS,
  };
  // *** quick maps end ***
}

export interface AppRoute {
  readonly segments: string;
  readonly parent?: AppRoute;
  readonly subsKeys: Array<string>;
  getRoute(): Array<string>;
}

/**
 * @param route an AppRoute object
 * @param subsValues array of values that correspond to AppRoute subsKeys and will replace placeholders in route
 * e.g. {job-id: 54} will change a route of "job/:job-id/details" to "job/54/details"
 */
export const getRoute = (route: AppRoute, subsValues?: Array<string>): Array<string> => {
  let url = (null != route.parent) ? route.parent.getRoute()[0] : '';
  url += '/' + route.segments;
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

