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
import { ProjectionComponent } from './pages/projection/projection.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { QuickMapsHeaderComponent } from './components/quickMapsHeader.component/quickMapsHeader.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { QuickMapsComponent } from './quickMaps.component';
import { BaselineDetailsModule } from './pages/baselineDetails/baselineDetails.module';
@NgModule({
  declarations: [
    QuickMapsComponent,
    LocationSelectComponent,
    SideNavContentComponent,
    ProjectionComponent,
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
  ],
  providers: [QuickMapsService],
})
export class QuickMapsModule { }
