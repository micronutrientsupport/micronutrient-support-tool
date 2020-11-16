export interface AppRoute {
  readonly key: string;
  route(): Array<string>;
}

/**
 * TODO: This would be more efficient as a pipe?
 * @param appRoute an AppRoute object
 * @param substitutions key-value pairs to replace placeholders in route e.g. {id: 54}
 * will change a route of "job/:id/details" to "job/54/details"
 */
function getRoute(appRoute: AppRoute, substitutions = {}): Array<string> {
  let url = `/${appRoute.key}`;
  Object.keys(substitutions).forEach((key: string) => {
    url = url.replace(`:${key}`, substitutions[key]);
  });

  return [url];
}

export class AppRoutes {
  public static readonly HOME = {
    key: '',
    route(): Array<string> { return getRoute(this); }
  } as AppRoute;
  public static readonly MAPS_TOOL = {
    key: 'maps-tool',
    route(): Array<string> { return getRoute(this); }
  } as AppRoute;
}

