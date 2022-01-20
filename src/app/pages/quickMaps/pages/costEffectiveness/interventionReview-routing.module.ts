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
        path: '',
        redirectTo: AppRoutes.INTERVENTION_REVIEW_BASELINE.getRouterPath(),
        pathMatch: 'full',
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_BASELINE.getRouterPath(),
        // path: '',
        component: InterventionBaselineComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_BASELINE,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW.getRouterPath(),
        component: InterventionAssumptionsReviewComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE.getRouterPath(),
        component: InterventionComplianceComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY.getRouterPath(),
        component: InterventionCostSummaryComponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION.getRouterPath(),
        component: InterventionIndustryInformationomponent,
        data: {
          appRoute: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION,
          title: '',
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
          title: '',
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
          title: '',
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
          title: '',
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
