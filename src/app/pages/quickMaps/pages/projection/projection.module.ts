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
import { ComponentsModule } from 'src/app/components/components.module';
import { ProjectionAvailabilityComponent } from './projectionAvailability/projectionAvailability.component';
import { ProjectionFoodSourcesComponent } from './projectionFoodSources/projectionFoodSources.component';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { ProjectionDescriptionComponent } from './projectionDescription/projectionDescription.component';
import { QuickMapsComponentsModule } from '../../components/quickMapsComponents.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UtilitiesModule } from 'src/utility/utilities.module';

@NgModule({
  declarations: [
    ProjectionComponent,
    ProjectionAvailabilityComponent,
    ProjectionFoodSourcesComponent,
    ProjectionDescriptionComponent,
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
    DialogModule,
    QuickMapsComponentsModule,
    PipesModule,
    UtilitiesModule,
  ],
})
export class ProjectionModule {}
