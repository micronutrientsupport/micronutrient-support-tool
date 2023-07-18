import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsRoutingModule } from './quickMaps-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from './quickMaps.service';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { QuickMapsComponent } from './quickMaps.component';
import { BaselineDetailsModule } from './pages/baselineDetails/baselineDetails.module';
import { ProjectionModule } from './pages/projection/projection.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';
import { BiomarkerModule } from './pages/biomarkers/biomarker.module';
import { QuickMapsComponentsModule } from './components/quickMapsComponents.module';
import { ExportService } from 'src/app/services/export.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DietaryChangeModule } from './pages/dietaryChange/dietaryChange.module';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TourService } from 'src/app/services/tour.service';
import { UncertaintyModule } from './pages/uncertainty/uncertainty.module';
import { ComponentsModule } from 'src/app/components/components.module';
@NgModule({
  declarations: [QuickMapsComponent, LocationSelectComponent],
  imports: [
    CommonModule,
    QuickMapsRoutingModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RoutesModule,
    BaselineDetailsModule,
    BiomarkerModule,
    ProjectionModule,
    MatProgressSpinnerModule,
    QuickMapsComponentsModule,
    PipesModule,
    DietaryChangeModule,
    UncertaintyModule,
    DirectivesModule,
    ComponentsModule,
  ],
  providers: [QuickMapsService, QuickMapsRouteGuardService, ExportService, PipesModule, DialogService, TourService],
})
export class QuickMapsModule {}
