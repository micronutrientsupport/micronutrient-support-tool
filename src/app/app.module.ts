import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { ServicesModule } from './services/services.module';
import { ApiModule } from './apiAndObjects/api.module';
import { QuickMapsRouteGuardService } from './pages/quickMaps/quickMapsRouteGuard.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    ComponentsModule,
    ApiModule,
    ServicesModule,
  ],
  exports: [],
  providers: [QuickMapsRouteGuardService, Title, Meta],
  bootstrap: [AppComponent],
})
export class AppModule { }
