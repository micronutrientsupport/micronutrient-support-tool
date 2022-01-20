import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from '../../quickMaps.service';
import { RoutesModule } from 'src/app/routes/routes.module';
import { ExportService } from 'src/app/services/export.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionReviewComponent } from './interventionReview.component';
import { InterventionReviewRoutingModule } from './interventionReview-routing.module';
@NgModule({
  declarations: [InterventionReviewComponent],
  imports: [
    CommonModule,
    InterventionReviewRoutingModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
  ],
  providers: [QuickMapsService, ExportService, PipesModule, DialogService],
})
export class InterventionReviewModule {}
