import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteData } from 'src/app/app-routing.module';
import { FeatureFlagGuard } from 'src/app/guards/featureFlagGuard';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionReviewComponent } from './interventionReview.component';
import { InterventionBaselineComponent } from './pages/interventionBaseline/interventionBaseline.component';
import { InterventionComplianceComponent } from './pages/interventionCompliance/interventionCompliance.component';
import { InterventionConsumptionComponent } from './pages/interventionConsumption/interventionConsumption.component';
import { InterventionCostSummaryComponent } from './pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionIndustryInformationComponent } from './pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionMonitoringInformationComponent } from './pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionRecurringCostsComponent } from './pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionStartupScaleupCostsComponent } from './pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { InterventionEffectivenessHouseholdsComponent } from './pages/interventionEffectivenessHouseholds/interventionEffectivenessHouseholds.component';
import { InterventionEffectivenessMetricsComponent } from './pages/interventionEffectivenessMetrics/interventionEffectivenessMetrics.component';

const routes: Routes = [
  {
    path: '',
    component: InterventionReviewComponent,
    children: [
      {
        path: AppRoutes.INTERVENTION_REVIEW_BASELINE.getRouterPath(),
        component: InterventionBaselineComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_BASELINE,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE.getRouterPath(),
        component: InterventionComplianceComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_CONSUMPTION.getRouterPath(),
        component: InterventionConsumptionComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_CONSUMPTION,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY.getRouterPath(),
        component: InterventionCostSummaryComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION.getRouterPath(),
        component: InterventionIndustryInformationComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
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
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
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
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
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
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_STARTUP_SCALEUP_COSTS,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_HOUSEHOLDS.getRouterPath(),
        component: InterventionEffectivenessHouseholdsComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_HOUSEHOLDS,
          title: '',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
      },
      {
        path: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_METRICS.getRouterPath(),
        component: InterventionEffectivenessMetricsComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
          appRoute: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_METRICS,
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
