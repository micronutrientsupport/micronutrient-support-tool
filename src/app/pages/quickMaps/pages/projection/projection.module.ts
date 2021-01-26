import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { GridsterModule } from 'angular-gridster2';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { ProjectionComponent } from './projection.component';
import { ProjectionDescriptionComponent } from './projectionDescription/projectionDescription.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProjectionCurrentEstimateComponent } from './projectionCurrentEstimate/projectionCurrentEstimate.component';
import { ProjectionAvailabilityComponent } from './projectionAvailability/projectionAvailability.component';
import { ProjectionFoodSourcesComponent } from './projectionFoodSources/projectionFoodSources.component';

@NgModule({
  declarations: [
    ProjectionComponent,
    ProjectionDescriptionComponent,
    ProjectionCurrentEstimateComponent,
    ProjectionAvailabilityComponent,
    ProjectionFoodSourcesComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
  ],
})
export class ProjectionModule {}
