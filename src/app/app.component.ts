import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { url } from 'inspector';
import { Subscription } from 'rxjs';
import { FooterRouteData } from './app-routing.module';
import { QuickMapsRouteData } from './pages/quickMaps/quickMaps-routing.module';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'micronutrient-support-tool';
  public showFullFooter: boolean;
  /**
   * To choose which routes do not show a large footer add this array
   */
  public minFooterPages = ['/quick-maps'];

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = this.activatedRoute.firstChild.data.subscribe((data: any) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          this.showFullFooter = data.FooterRouteData;
        });
      }
    });
  }
}
