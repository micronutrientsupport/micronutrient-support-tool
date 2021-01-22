import { Component } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, GuardsCheckEnd, GuardsCheckStart, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteData } from './app-routing.module';
import { PageLoadingService } from './services/pageLoadingService.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'micronutrient-support-tool';
  public showLightFooter = false;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public pageLoadingService: PageLoadingService,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = this.activatedRoute.firstChild.data.subscribe((data: RouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }

          this.showLightFooter = true === data.showLightFooter;
        });

        // now reset the window scroll position
        window.scrollTo(0, 0);
      }

      if (event instanceof GuardsCheckStart) {
        this.pageLoadingService.showLoading(true);
        // console.log('GuardStart');
      }
      if (event instanceof GuardsCheckEnd) {
        this.pageLoadingService.showLoading(false);
        // console.log('GuardEnd');
      }

    });
  }
}
