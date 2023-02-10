import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { InterventionIndustryInformationComponent } from './interventionReview/pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './interventionReview/pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './interventionReview/pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './interventionReview/pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { InterventionReviewComponentsModule } from './interventionReview/components/interventionReviewComponents.module';
import { InterventionConsumptionComponent } from './interventionReview/pages/interventionConsumption/interventionConsumption.component';
import { InterventionAssumptionsReviewComponent } from './interventionReview/pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionSideNavContentService } from './interventionReview/components/interventionSideNavContent/interventionSideNavContent.service';
import { InterventionDescriptionComponent } from './interventionReview/components/interventionDescription/interventionDescription.component';
import { InterventionCostSummaryQuickUndiscountedTableComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/tableTotalUndiscounted/tableTotalUndiscounted.component';
import { InterventionCostSummaryDetailedCostsGraphComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/graphCosts/graphCosts.component';
import { InterventionCostSummaryDetailedRecurringTableComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/tableRecurringCosts/tableRecurringCosts.component';
import { InterventionCostSummaryDetailedStartupTableComponent } from './interventionReview/pages/interventionCostSummary/components/detailedView/tableStartupCosts/tableStartupCosts.component';
import { InterventionCostSummaryQuickTotalGraphComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/graphTotal/graphTotal.component';
import { InterventionCostSummaryQuickDiscountedTableComponent } from './interventionReview/pages/interventionCostSummary/components/quickSummary/tableTotalDiscounted/tableTotalDiscounted.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReusableCostGraphComponent } from './interventionReview/utilities/reusableCostGraph/reusableCostGraph.component';
import { ReusableCostTableComponent } from './interventionReview/utilities/reusableCostTable/reusableCostTable.component';
import { InterventionStepDetailsComponent } from './interventionReview/utilities/interventionStepDetails/interventionStepDetails.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MicroNutrientsInPremixTableComponent } from './interventionReview/utilities/microNutrientsInPremixTable/microNutrientsInPremixTable.component';
import { PremixTableComponent } from './interventionReview/utilities/microNutrientsInPremixTable/premixTableRow/premixTable.component';
import { AvgMnTableComponent } from './interventionReview/utilities/avgMnTable/avgMnTable.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AddMicronutrientComponent } from './interventionReview/components/add-micronutrient/add-micronutrient.component';
import { QuickMapsModule } from '../../quickMaps.module';

@NgModule({
  declarations: [
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
    InterventionStepDetailsComponent,
    MicroNutrientsInPremixTableComponent,
    PremixTableComponent,
    AvgMnTableComponent,
    AddMicronutrientComponent,
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
    MatFormFieldModule,
    FormsModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
  ],
  providers: [QuickMapsService, ExportService, PipesModule, DialogService, InterventionSideNavContentService],
  exports: [],
})
export class InterventionReviewModule {}
