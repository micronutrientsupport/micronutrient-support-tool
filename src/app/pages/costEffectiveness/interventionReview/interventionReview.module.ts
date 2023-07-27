import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { ExportService } from 'src/app/services/export.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { InterventionReviewComponent } from './interventionReview.component';
import { InterventionReviewRoutingModule } from './interventionReview-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InterventionBaselineComponent } from './pages/interventionBaseline/interventionBaseline.component';
import { QuickMapsService } from '../../quickMaps/quickMaps.service';
import { CostEffectivenessComponentsModule } from '../components/costEffectivenessComponents.module';
import { AddMicronutrientComponent } from './components/add-micronutrient/add-micronutrient.component';
import { InterventionDescriptionComponent } from './components/interventionDescription/interventionDescription.component';
import { InterventionReviewComponentsModule } from './components/interventionReviewComponents.module';
import { InterventionSideNavContentService } from './components/interventionSideNavContent/interventionSideNavContent.service';
import { InterventionAssumptionsReviewComponent } from './pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionComplianceComponent } from './pages/interventionCompliance/interventionCompliance.component';
import { InterventionConsumptionComponent } from './pages/interventionConsumption/interventionConsumption.component';
import { InterventionCostSummaryDetailedCostsGraphComponent } from './pages/interventionCostSummary/components/detailedView/graphCosts/graphCosts.component';
import { InterventionCostSummaryDetailedRecurringTableComponent } from './pages/interventionCostSummary/components/detailedView/tableRecurringCosts/tableRecurringCosts.component';
import { InterventionCostSummaryDetailedStartupTableComponent } from './pages/interventionCostSummary/components/detailedView/tableStartupCosts/tableStartupCosts.component';
import { InterventionCostSummaryQuickTotalGraphComponent } from './pages/interventionCostSummary/components/quickSummary/graphTotal/graphTotal.component';
import { InterventionCostSummaryQuickDiscountedTableComponent } from './pages/interventionCostSummary/components/quickSummary/tableTotalDiscounted/tableTotalDiscounted.component';
import { InterventionCostSummaryQuickUndiscountedTableComponent } from './pages/interventionCostSummary/components/quickSummary/tableTotalUndiscounted/tableTotalUndiscounted.component';
import { InterventionCostSummaryComponent } from './pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationComponent } from './pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { AvgMnTableComponent } from './utilities/avgMnTable/avgMnTable.component';
import { InterventionStepDetailsComponent } from './utilities/interventionStepDetails/interventionStepDetails.component';
import { MicroNutrientsInPremixTableComponent } from './utilities/microNutrientsInPremixTable/microNutrientsInPremixTable.component';
import { PremixTableComponent } from './utilities/microNutrientsInPremixTable/premixTableRow/premixTable.component';
import { ReusableCostGraphComponent } from './utilities/reusableCostGraph/reusableCostGraph.component';
import { ReusableCostTableComponent } from './utilities/reusableCostTable/reusableCostTable.component';
import { ReusableSkeletonTableComponent } from './utilities/reusableSkeletonTable/reusableSkeletonTable.component';

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
    ReusableSkeletonTableComponent,
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
    RoutesModule,
    CostEffectivenessComponentsModule,
    InterventionReviewComponentsModule,
    MatFormFieldModule,
    FormsModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [QuickMapsService, ExportService, PipesModule, DialogService, InterventionSideNavContentService],
  exports: [],
})
export class InterventionReviewModule {}
