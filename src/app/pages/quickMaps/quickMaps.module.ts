import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsRoutingModule } from './quickMaps-routing.module';

import { QuickMapsComponent } from './pages/quickMaps.component';
import { MapPageComponent } from './pages/components/mapPage/mapPage.component';
import { SideNavContentComponent } from './pages/components/sideNavContent/sideNavContent.component';
import { BaselineComponent } from './pages/baseline/baseline.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from './quickMaps.service';

@NgModule({
  declarations: [QuickMapsComponent, MapPageComponent, SideNavContentComponent, BaselineComponent, ProjectionComponent],
  imports: [CommonModule, QuickMapsRoutingModule, LeafletModule, HttpClientModule, AppMaterialModule, ReactiveFormsModule],
  providers: [QuickMapsService]
})
export class QuickMapsModule { }
