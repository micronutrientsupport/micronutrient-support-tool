export interface AppRoute {
  readonly key: string;
  route(): Array<string>;
}

/**
 * TODO: This would be more efficient as a pipe?
 *
 * @param appRoute an AppRoute object
 * @param substitutions key-value pairs to replace placeholders in route e.g. {job-id: 54}
 * will change a route of "job/:job-id/details" to "job/54/details"
 */
const getRoute = (appRoute: AppRoute, substitutions = {}): Array<string> => {
  let url = `/${appRoute.key}`;
  Object.keys(substitutions).forEach((key: string) => {
    url = url.replace(`:${key}`, substitutions[key]);
  });

  return [url];
};

export class AppRoutes {
  public static readonly HOME = {
    key: '',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly MAPS_TOOL = {
    key: 'maps-tool',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly QUICK_MAPS = {
    key: `${AppRoutes.MAPS_TOOL.key}/quick-maps`,
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly EDUCATIONAL_RESOURCES = {
    key: 'educational-resources',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly HELP = {
    key: 'help',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly PROJECT_OBJECTIVES = {
    key: 'project-objectives',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
  public static readonly STYLE_GUIDE = {
    key: 'style-guide',
    route(): Array<string> {
      return getRoute(this);
    },
  } as AppRoute;
}
