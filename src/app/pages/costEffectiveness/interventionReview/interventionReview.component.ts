import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoutes } from 'src/app/routes/routes';
import { QuickMapsService } from '../../quickMaps/quickMaps.service';

@Component({
  selector: 'app-intervention-review',
  templateUrl: './interventionReview.component.html',
  styleUrls: ['./interventionReview.component.scss'],
})
export class InterventionReviewComponent implements OnInit {
  public ROUTES = AppRoutes;
  public showHeader = false;
  public showGoButton = false;

  constructor(router: Router, private activatedRoute: ActivatedRoute, public quickMapsService: QuickMapsService) {
    router.events.subscribe((event) => {
      // console.log('quickmaps = ', event);
      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {
        const route = this.getActivatedRoute(this.activatedRoute);
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = route.data.subscribe((data: RouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          this.showHeader = true !== data.hideQuickMapsHeader;
          this.showGoButton = true === data.showQuickMapsGoButton;
          // console.debug('route data', this.showGoButton, route, data);
        });
      }
    });
  }

  ngOnInit(): void {
    // ensure values set in query params if we have navigated back to
    // quickmaps having been here before, since the service exists from last time.
    let subs: Subscription;
    // eslint-disable-next-line prefer-const
    subs = this.quickMapsService.init.obs.subscribe((initialised) => {
      if (initialised) {
        if (null != subs) {
          // unsubscribe as only need to do it once.
          subs.unsubscribe();
        }
        this.quickMapsService.updateQueryParams();
      }
    });
  }

  private getActivatedRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getActivatedRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
