import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { CostEffectivenessComponent } from '../costEffectiveness/costEffectiveness.component';
import { RouteData } from 'src/app/app-routing.module';
import { FeatureFlagGuard } from 'src/app/guards/featureFlagGuard';
import { InterventionStartupScaleupCostsComponent } from './interventionReview/pages/interventionStartupScaleupCosts/interventionStartupScaleupCosts.component';
import { InterventionRecurringCostsComponent } from './interventionReview/pages/interventionRecurringCosts/interventionRecurringCosts.component';
import { InterventionMonitoringInformationComponent } from './interventionReview/pages/interventionMonitoringInformation/interventionMonitoringInformation.component';
import { InterventionIndustryInformationComponent } from './interventionReview/pages/interventionIndustryInformation/interventionIndustryInformation.component';
import { InterventionCostSummaryComponent } from './interventionReview/pages/interventionCostSummary/interventionCostSummary.component';
import { InterventionConsumptionComponent } from './interventionReview/pages/interventionConsumption/interventionConsumption.component';
import { InterventionComplianceComponent } from './interventionReview/pages/interventionCompliance/interventionCompliance.component';
import { InterventionAssumptionsReviewComponent } from './interventionReview/pages/interventionAssumptionsReview/interventionAssumptionsReview.component';
import { InterventionBaselineComponent } from './interventionReview/pages/interventionBaseline/interventionBaseline.component';

const routes: Routes = [
  {
    path: '',
    component: CostEffectivenessComponent,
    children: [
      // {
      //   path: AppRoutes.COST_EFFECTIVENESS.getRouterPath(),
      //   component: CostEffectivenessComponent,
      //   canActivate: [FeatureFlagGuard],
      //   canLoad: [FeatureFlagGuard],
      //   data: {
      //     featureFlag: 'CE-Enable',
      //     appRoute: AppRoutes.COST_EFFECTIVENESS,
      //     title: 'Explore cost effectiveness scenarios',
      //     keywords: '',
      //     description: '',
      //     showLightFooter: true,
      //   } as RouteData,
      // }
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
        path: AppRoutes.INTERVENTION_REVIEW_ASSUMPTIONS_REVIEW.getRouterPath(),
        component: InterventionAssumptionsReviewComponent,
        canActivate: [FeatureFlagGuard],
        canLoad: [FeatureFlagGuard],
        data: {
          featureFlag: 'CE-Enable',
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
    ],
  },
  // {
  //   path: AppRoutes.COST_EFFECTIVENESS.getRouterPath() + '**',
  //   loadChildren: () =>
  //     import('src/app/pages/costEffectiveness/interventionReview.module').then((m) => m.InterventionReviewModule),
  // },
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class costEffectivenessRoutingModule {}
