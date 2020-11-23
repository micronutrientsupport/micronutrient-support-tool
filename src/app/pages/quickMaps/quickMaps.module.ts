import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsRoutingModule } from './quickMaps-routing.module';
import { SideNavContentComponent } from './components/sideNavContent/sideNavContent.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from './quickMaps.service';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { QuickMapsHeaderComponent } from './components/quickMapsHeader.component/quickMapsHeader.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { MapViewComponent } from '../quickMaps/pages/baselineDetails/map-view/map-view.component';

@NgModule({
  declarations: [
    LocationSelectComponent,
    SideNavContentComponent,
    ProjectionComponent,
    BaselineDetailsComponent,
    QuickMapsHeaderComponent,
    MapViewComponent
  ],
  imports: [
    CommonModule,
    QuickMapsRoutingModule, LeafletModule, HttpClientModule, AppMaterialModule, ReactiveFormsModule, ChartjsModule, RoutesModule],
  providers: [QuickMapsService, QuickMapsRouteGuardService]
})
export class QuickMapsModule { }
