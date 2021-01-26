import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, GuardsCheckEnd, GuardsCheckStart, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteData } from './app-routing.module';
import { PageLoadingService } from './services/pageLoadingService.service';
import { filter } from 'rxjs/operators';
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
    private titleService: Title,
    private metaService: Meta,
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

    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const meta = this.getChild(this.activatedRoute);
      meta.data.subscribe((data: RouteData) => {
        if (data.keywords) {
          const keyword = this.metaService.getTag('name=\'keywords\'');

          if (null === keyword) {
            this.metaService.addTag({ name: 'keywords', content: data.keywords });
          } else {
            this.metaService.updateTag({ name: 'keywords', content: data.keywords });
          }
        }
        else {
          this.metaService.removeTag('name=\'keywords\'');
        }

        if (data.description) {
          const description = this.metaService.getTag('name=\'description\'');

          if (null === description) {
            this.metaService.addTag({ name: 'description', content: data.description });
          } else {
            this.metaService.updateTag({ name: 'description', content: data.description });
          }
        }
        else {
          this.metaService.removeTag('name=\'description\'');
        }

        if (data.title) {
          this.titleService.setTitle(data.title);
        }
      });
    });
  }

  public getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

}
