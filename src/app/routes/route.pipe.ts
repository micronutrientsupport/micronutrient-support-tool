import { Pipe, PipeTransform } from '@angular/core';
import { getRoute, AppRoute } from './routes';

@Pipe({ name: 'route' })
export class RoutePipe implements PipeTransform {
  public transform(route: AppRoute, subsValues: Array<string>): Array<string> {
    return (getRoute(route, subsValues));
  }
}
