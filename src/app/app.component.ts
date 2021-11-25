import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ChildActivationEnd,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationEnd,
  Router,
} from '@angular/router';
import { detect } from 'detect-browser';
import { NgxFeedbackService } from 'ngx-feedback-maps/dist/ngx-feedback-maps';
import { Subscription } from 'rxjs';
import { ApiService } from './apiAndObjects/api/api.service';
import { PostFeedbackParams } from './apiAndObjects/api/feedback/postFeedback';
import { environment } from 'src/environments/environment.base';
import { RouteData } from './app-routing.module';
import { PageLoadingService } from './services/pageLoadingService.service';
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
    private metaService: Meta,
    private apiService: ApiService,
    private readonly feedbackService: NgxFeedbackService,
  ) {
    router.events.subscribe((event) => {
      // console.debug('router event', event);
      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {
        const route = this.getActivatedRoute(this.activatedRoute);
        let subs: Subscription;
        // eslint-disable-next-line prefer-const
        subs = route.data.subscribe((data: RouteData) => {
          if (null != subs) {
            subs.unsubscribe();
          }
          // console.debug('route data', route, data);
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
        this.pageLoadingService.endLoading();
        // console.log('GuardEnd');
      }
    });
  }

  ngOnInit(): void {
    this.feedbackService.listenForFeedbacks().subscribe((data: PostFeedbackParams) => {
      const browser = detect();
      data.page = window.location.href;
      data.browser = `${browser.name.charAt(0).toUpperCase()}${browser.name.slice(1)}: ${browser.version}`;
      data.os = browser.os;
      data.height = window.innerHeight;
      data.width = window.innerWidth;
      void this.apiService.endpoints.misc.postFeedback.call(data);
    });

    // Inject snippet for plausible.io at app startup
    this.loadAnalyticsSnippet();
  }

  private loadAnalyticsSnippet() {
    const analyticsScript = document.createElement('script');
    analyticsScript.type = 'text/javascript';
    analyticsScript.async = true;
    analyticsScript.defer = true;
    analyticsScript.src = environment.analyticsSnippetUrl;
    analyticsScript.dataset.domain = environment.analyticsDomain;
    document.body.appendChild(analyticsScript);
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
    } else {
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
