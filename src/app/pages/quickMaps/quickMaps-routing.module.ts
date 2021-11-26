import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoutes } from 'src/app/routes/routes';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
import { BiomarkerComponent } from './pages/biomarkers/biomarker.component';
import { CostEffectivenessComponent } from './pages/costEffectiveness/costEffectiveness.component';
import { DietaryChangeComponent } from './pages/dietaryChange/dietaryChange.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { NoResultsComponent } from './pages/noResults/noResults.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { QuickMapsComponent } from './quickMaps.component';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';

const routes: Routes = [
  {
    path: '',
    component: QuickMapsComponent,
    children: [
      {
        path: AppRoutes.QUICK_MAPS_LOCATION_SELECT.getRouterPath(),
        component: LocationSelectComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_LOCATION_SELECT,
          title: 'Quick MAPS',
          keywords: 'Micronutrients, maps, policy, quick maps, form, selection',
          description: 'Quick Maps form for selecting and filtering search criteria',
          hideQuickMapsHeader: true,
          showLightFooter: true,
          showQuickMapsGoButton: true,
        } as RouteData,
      },
      {
        path: AppRoutes.QUICK_MAPS_NO_RESULTS.getRouterPath(),
        component: NoResultsComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_NO_RESULTS,
          title: 'Quick MAPS',
          keywords: 'Micronutrients, maps, policy, quick maps, form, selection',
          description: 'Quick Maps no results found',
          hideQuickMapsHeader: true,
          showLightFooter: true,
          showQuickMapsGoButton: false,
        } as RouteData,
      },
      {
        path: AppRoutes.QUICK_MAPS_BASELINE.getRouterPath(),
        component: BaselineDetailsComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_BASELINE,
          title: 'Quick MAPS - Baseline',
          keywords: 'Micronutrients, maps, policy, project objectives',
          description:
            'Baseline estimates of dietary MN supplies and deficiency risks in the selected country or region.',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_PROJECTION.getRouterPath(),
        component: ProjectionComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_PROJECTION,
          title: 'Quick MAPS - Projections to 2050',
          keywords:
            'projections, scenarios, micronutrients, food systems, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050',
          description: 'Projections of food system changes under various scenarios.',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_DIETARY_CHANGE.getRouterPath(),
        component: DietaryChangeComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_DIETARY_CHANGE,
          title: 'Quick MAPS - Simple dietary change scenarios',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_COST_EFFECTIVENESS.getRouterPath(),
        component: CostEffectivenessComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_COST_EFFECTIVENESS,
          title: 'Quick MAPS - Explore cost effectiveness scenarios',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_BIOMARKER.getRouterPath(),
        component: BiomarkerComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_BIOMARKER,
          title: 'Quick Maps - Biomarker',
          keywords: '',
          description: '',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
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
export class QuickMapsRoutingModule {}
