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
import { InterventionBaselineComponent } from './interventionReview/pages/interventionBaseline/interventionBaseline.component';
import { InterventionComplianceComponent } from './interventionReview/pages/interventionCompliance/interventionCompliance.component';
import { InterventionCostSummaryComponent } from './interventionReview/pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationomponent } from './interventionReview/pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './interventionReview/pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './interventionReview/pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './interventionReview/pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { InterventionReviewComponentsModule } from './interventionReview/components/interventionReviewComponents.module';
import { InterventionConsumptionComponent } from './interventionReview/pages/interventionConsumption/interventionConsumption.component';
import { InterventionAssumptionsReviewComponent } from './interventionReview/pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionSideNavContentService } from './interventionReview/components/interventionSideNavContent/interventionSideNavContent.service';
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
    InterventionConsumptionComponent,
    InterventionAssumptionsReviewComponent,
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
    CostEffectivenessComponentsModule,
    InterventionReviewComponentsModule,
  ],
  providers: [QuickMapsService, ExportService, PipesModule, DialogService, InterventionSideNavContentService],
  exports: [],
})
export class InterventionReviewModule {}
