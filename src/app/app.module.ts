import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { ServicesModule } from './services/services.module';
import { ApiModule } from './apiAndObjects/api.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FeatureFlagsFactory } from './services/featureFlags.factory';
import { FeatureFlagsService } from './services/featureFlags.service';
import { DirectivesModule } from './directives/directives.module';
import { NgCustomerFeedbackMapsModule } from 'ng-customer-feedback-maps';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [AppComponent, FeedbackComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    ComponentsModule,
    ApiModule,
    ServicesModule,
    ClipboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    DirectivesModule,
    NgCustomerFeedbackMapsModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [],
  providers: [
    Title,
    Meta,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: FeatureFlagsFactory.preloadFeatureFlags,
      deps: [FeatureFlagsService],
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
