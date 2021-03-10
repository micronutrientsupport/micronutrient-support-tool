/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { distance } from 'fastest-levenshtein';
@Injectable({
  providedIn: 'root',
})
export class PathResolveService implements Resolve<string | null> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | null {
    const allRoutes = Object.keys(AppRoutes).map((key: string) => AppRoutes[key].getRoute().join('/'));
    const typoPath = state.url.replace('/', '');
    const dictionary = Object.values(allRoutes);
    if (!dictionary.length) {
      return null;
    }
    this.sortByDistances(typoPath, dictionary);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `/${dictionary[0]}`;
  }

  //  Compare the two strings using the leventein algorithm to find the closest
  // matching route. Then return the dictionary item which best matches
  public sortByDistances(typoPath: string, dictionary: string[]): void {
    const pathsDistance = {} as { [name: string]: number };
    dictionary.sort((a, b) => {
      if (!(a in pathsDistance)) {
        pathsDistance[a] = distance(a, typoPath);
      }
      if (!(b in pathsDistance)) {
        pathsDistance[b] = distance(b, typoPath);
      }
      return pathsDistance[a] - pathsDistance[b];
    });
  }
}
