import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionReviewComponent } from './interventionReview.component';
import { InterventionAssumptionsReviewComponent } from './pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionBaselineComponent } from './pages/interventionBaseline/interventionBaseline.component';
import { InterventionComplianceComponent } from './pages/interventionCompliance/interventionCompliance.component';
import { InterventionCostSummaryComponent } from './pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationomponent } from './pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';

const routes: Routes = [
  {
    path: '',
    component: InterventionReviewComponent,
    children: [
      {
        path: AppRoutes.INTERVENTION_REVIEW_BASELINE.getRouterPath(),
        component: InterventionBaselineComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_BASELINE,
          title: 'Quick MAPS',
          keywords: 'Micronutrients, maps, policy, quick maps, form, selection',
          description: 'Quick Maps form for selecting and filtering search criteria',
          hideQuickMapsHeader: true,
          showLightFooter: true,
          showQuickMapsGoButton: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW.getRouterPath(),
        component: InterventionAssumptionsReviewComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW,
          title: 'Quick MAPS',
          keywords: 'Micronutrients, maps, policy, quick maps, form, selection',
          description: 'Quick Maps no results found',
          hideQuickMapsHeader: true,
          showLightFooter: true,
          showQuickMapsGoButton: false,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE.getRouterPath(),
        component: InterventionComplianceComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE,
          title: 'Quick MAPS - Baseline',
          keywords: 'Micronutrients, maps, policy, project objectives',
          description:
            'Baseline estimates of dietary MN supplies and deficiency risks in the selected country or region.',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY.getRouterPath(),
        component: InterventionCostSummaryComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY,
          title: 'Quick MAPS - Projections to 2050',
          keywords:
            'projections, scenarios, micronutrients, food systems, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050',
          description: 'Projections of food system changes under various scenarios.',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION.getRouterPath(),
        component: InterventionIndustryInformationomponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION,
          title: 'Quick MAPS - Simple dietary change scenarios',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_MONITORING_INFORMATION.getRouterPath(),
        component: InterventionMonitoringInformationComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_MONITORING_INFORMATION,
          title: 'Quick MAPS - Explore cost effectiveness scenarios',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_RECURRING_COSTS.getRouterPath(),
        component: InterventionRecurringCostsComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_RECURRING_COSTS,
          title: 'Quick Maps - Biomarker',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_STARTUP_SCALEUP_COSTS.getRouterPath(),
        component: InterventionStartupScaleupCostsComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_STARTUP_SCALEUP_COSTS,
          title: 'Quick Maps - Biomarker',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterventionReviewRoutingModule {}
