import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsRoutingModule } from './quickMaps-routing.module';
import { QuickMapsComponent } from './quickMaps.component';
import { MapPageComponent } from './components/mapPage/mapPage.component';
import { SideNavContentComponent } from './components/sideNavContent/sideNavContent.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { BaselineDetailsComponent } from './components/baselineDetails/baselineDetails.component';

import { QuickMapsComponent } from './pages/quickMaps.component';
import { MapPageComponent } from './pages/components/mapPage/mapPage.component';
import { SideNavContentComponent } from './pages/components/sideNavContent/sideNavContent.component';
import { BaselineComponent } from './pages/baseline/baseline.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from './quickMaps.service';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';

@NgModule({
  declarations: [QuickMapsComponent, MapPageComponent, SideNavContentComponent, BaselineComponent, ProjectionComponent, BaselineDetailsComponent],
  imports: [CommonModule, QuickMapsRoutingModule, LeafletModule, HttpClientModule, AppMaterialModule, ReactiveFormsModule, ChartjsModule],
  providers: [QuickMapsService, QuickMapsRouteGuardService, ]
})
export class QuickMapsModule { }
