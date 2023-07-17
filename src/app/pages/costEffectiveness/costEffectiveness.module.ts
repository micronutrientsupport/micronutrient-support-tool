import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { GridsterModule } from 'angular-gridster2';
import { QuickMapsService } from '../quickMaps/quickMaps.service';
// import { InterventionReviewModule } from './interventionReview.module';
import { costEffectivenessRoutingModule } from './costEffectiveness-routing.module';
import { InterventionReviewComponent } from './interventionReview.component';
import { InterventionBaselineComponent } from './interventionReview/pages/interventionBaseline/interventionBaseline.component';
import { InterventionComplianceComponent } from './interventionReview/pages/interventionCompliance/interventionCompliance.component';
import { InterventionCostSummaryComponent } from './interventionReview/pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationComponent } from './interventionReview/pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionRecurringCostsComponent } from './interventionReview/pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionConsumptionComponent } from './interventionReview/pages/interventionConsumption/interventionConsumption.component';
import { InterventionMonitoringInformationComponent } from './interventionReview/pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionStartupScaleupCostsComponent } from './interventionReview/pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { InterventionStepDetailsComponent } from './interventionReview/utilities/interventionStepDetails/interventionStepDetails.component';
import { PremixTableComponent } from './interventionReview/utilities/microNutrientsInPremixTable/premixTableRow/premixTable.component';
import { AvgMnTableComponent } from './interventionReview/utilities/avgMnTable/avgMnTable.component';
import { AddMicronutrientComponent } from './interventionReview/components/add-micronutrient/add-micronutrient.component';
import { MicroNutrientsInPremixTableComponent } from './interventionReview/utilities/microNutrientsInPremixTable/microNutrientsInPremixTable.component';
import { ReusableCostGraphComponent } from './interventionReview/utilities/reusableCostGraph/reusableCostGraph.component';
import { InterventionCostSummaryDetailedRecurringTableComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/tableRecurringCosts/tableRecurringCosts.component';
import { InterventionCostSummaryQuickUndiscountedTableComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/tableTotalUndiscounted/tableTotalUndiscounted.component';
import { InterventionAssumptionsReviewComponent } from './interventionReview/pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionDescriptionComponent } from './interventionReview/components/interventionDescription/interventionDescription.component';
import { InterventionCostSummaryQuickDiscountedTableComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/tableTotalDiscounted/tableTotalDiscounted.component';
import { InterventionCostSummaryQuickTotalGraphComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/graphTotal/graphTotal.component';
import { InterventionCostSummaryDetailedStartupTableComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/tableStartupCosts/tableStartupCosts.component';
import { InterventionCostSummaryDetailedCostsGraphComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/graphCosts/graphCosts.component';
import { ReusableCostTableComponent } from './interventionReview/utilities/reusableCostTable/reusableCostTable.component';
import { ReusableSkeletonTableComponent } from './interventionReview/utilities/reusableSkeletonTable/reusableSkeletonTable.component';
import { ExportService } from 'src/app/services/export.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InterventionReviewComponentsModule } from './interventionReview/components/interventionReviewComponents.module';
import { RoutesModule } from 'src/app/routes/routes.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { AppMaterialModule } from 'src/app/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
// import { InterventionSideNavContentService } from './interventionReview/components/interventionSideNavContent/interventionSideNavContent.service';

@NgModule({
  declarations: [
    CostEffectivenessComponent,
    InterventionReviewComponent,
    InterventionBaselineComponent,
    InterventionComplianceComponent,
    InterventionCostSummaryComponent,
    InterventionIndustryInformationComponent,
    InterventionMonitoringInformationComponent,
    InterventionRecurringCostsComponent,
    InterventionStartupScaleupCostsComponent,
    InterventionConsumptionComponent,
    InterventionAssumptionsReviewComponent,
    InterventionDescriptionComponent,
    InterventionCostSummaryQuickUndiscountedTableComponent,
    InterventionCostSummaryQuickDiscountedTableComponent,
    InterventionCostSummaryQuickTotalGraphComponent,
    InterventionCostSummaryDetailedStartupTableComponent,
    InterventionCostSummaryDetailedRecurringTableComponent,
    InterventionCostSummaryDetailedCostsGraphComponent,
    ReusableCostGraphComponent,
    ReusableCostTableComponent,
    ReusableSkeletonTableComponent,
    InterventionStepDetailsComponent,
    MicroNutrientsInPremixTableComponent,
    PremixTableComponent,
    AvgMnTableComponent,
    AddMicronutrientComponent,
  ],

  imports: [
    ComponentsModule,
    CommonModule,
    CostEffectivenessComponentsModule,
    GridsterModule,
    costEffectivenessRoutingModule,
    // InterventionReviewRoutingModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    InterventionReviewComponentsModule,
    MatFormFieldModule,
    FormsModule,
    PipesModule,
    DirectivesModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [CostEffectivenessComponent],
  providers: [
    QuickMapsService,
    ExportService,
    PipesModule,
    DialogService,
    //InterventionSideNavContentService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostEffectivenessModule {}
