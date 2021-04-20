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
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { QuickMapsHeaderComponent } from './components/quickMapsHeader.component/quickMapsHeader.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { QuickMapsComponent } from './quickMaps.component';
import { BaselineDetailsModule } from './pages/baselineDetails/baselineDetails.module';
import { ProjectionModule } from './pages/projection/projection.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';
import { BiomarkerModule } from './pages/biomarkers/biomarker.module';
@NgModule({
  declarations: [
    QuickMapsComponent,
    LocationSelectComponent,
    SideNavContentComponent,
    QuickMapsHeaderComponent,
  ],
  imports: [
    CommonModule,
    QuickMapsRoutingModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    BaselineDetailsModule,
    BiomarkerModule,
    ProjectionModule,
    MatProgressSpinnerModule,
  ],
  providers: [QuickMapsService, QuickMapsRouteGuardService],
})
export class QuickMapsModule { }
