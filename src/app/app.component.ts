import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
    private titleService: Title,
    private metaService: Meta,
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {
        const route = this.getActivatedRoute(this.activatedRoute);
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = route.data.subscribe((data: RouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          this.showLightFooter = true === data.showLightFooter;

          this.updateMetaTag(data.keywords, 'keywords');
          this.updateMetaTag(data.description, 'description');

          this.updateTitle(data.title);
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

  private getActivatedRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getActivatedRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  private updateMetaTag(content: string, tagName: string): void {
    if (null != content) {
      const tag = this.metaService.getTag(`name='${tagName}'`);

      if (null === tag) {
        this.metaService.addTag({ name: tagName, content });
      } else {
        this.metaService.updateTag({ name: tagName, content });
      }
    }
    else {
      this.metaService.removeTag(`name='${tagName}'`);
    }
  }

  private updateTitle(subTitle: string): void {
    let title = 'Micronutrient Action Policy Support (MAPS)';
    if (null != subTitle) {
      title += `: ${subTitle}`;
    }
    this.titleService.setTitle(title);
  }
}
