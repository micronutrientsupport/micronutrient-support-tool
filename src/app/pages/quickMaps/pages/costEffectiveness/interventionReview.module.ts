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
import { InterventionBaselineComponent } from './pages/interventionBaseline/interventionBaseline.component';
import { InterventionComplianceComponent } from './pages/interventionCompliance/interventionCompliance.component';
import { InterventionCostSummaryComponent } from './pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationomponent } from './pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
@NgModule({
  declarations: [
    InterventionReviewComponent,
    InterventionBaselineComponent,
    InterventionComplianceComponent,
    InterventionCostSummaryComponent,
    InterventionIndustryInformationomponent,
    InterventionMonitoringInformationComponent,
    InterventionRecurringCostsComponent,
    InterventionStartupScaleupCostsComponent,
  ],
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
  exports: [],
})
export class InterventionReviewModule {}
