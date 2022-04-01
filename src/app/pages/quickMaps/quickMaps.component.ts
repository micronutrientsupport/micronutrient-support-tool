import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { QuickMapsService } from './quickMaps.service';
import { Subscription } from 'rxjs';
import { RouteData } from 'src/app/app-routing.module';
import { TourService } from 'src/app/services/tour.service';
import { FeatureFlagsService } from 'src/app/services/featureFlags.service';

@Component({
  selector: 'app-quickmaps',
  templateUrl: './quickMaps.component.html',
  styleUrls: ['./quickMaps.component.scss'],
})
export class QuickMapsComponent implements OnInit, AfterViewInit {
  public showHeader = false;
  public showGoButton = false;

  constructor(
    router: Router,
    private activatedRoute: ActivatedRoute,
    public quickMapsService: QuickMapsService,
    public tourService: TourService,
    public featureFlagsService: FeatureFlagsService,
  ) {
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

  ngAfterViewInit(): void {
    if (this.featureFlagsService.isEnabled('quick-maps-loading-tour')) {
      setTimeout(() => {
        const hasSeenTour = Boolean(localStorage.getItem('has-viewed-tour'));
        console.log(hasSeenTour);
        if (!hasSeenTour || this.featureFlagsService.isEnabled('quick-maps-tour-always')) {
          console.log('Request the quick-maps sidebar tour');
          this.tourService.startTour('Welcome to Quick MAPS');
          this.tourService.createOverlayWelcomeTour();
          localStorage.setItem('has-viewed-tour', 'true');
        } else {
          console.log('Tour already viewed so skipping');
        }
      });
    }
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
