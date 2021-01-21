import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, GuardsCheckEnd, GuardsCheckStart, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteData } from './app-routing.module';
import { PageLoadingService } from './services/pageLoadingService.service';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'micronutrient-support-tool';
  public showLightFooter = false;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public pageLoadingService: PageLoadingService,
    private titleService: Title,
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

  ngOnInit(): void {
    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child.snapshot.data.title) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return child.snapshot.data.title;
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }
}
