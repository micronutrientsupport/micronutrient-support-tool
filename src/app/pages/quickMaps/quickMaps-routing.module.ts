import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteData } from 'src/app/app-routing.module';
import { AppRoutes } from 'src/app/routes/routes';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
import { BiomarkerComponent } from './pages/biomarkers/biomarker.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { QuickMapsComponent } from './quickMaps.component';
import { QuickMapsRouteGuardService } from './quickMapsRouteGuard.service';

const routes: Routes = [
  {
    path: '',
    component: QuickMapsComponent,
    children: [
      {
        path: '',
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
        path: AppRoutes.QUICK_MAPS_BASELINE.getRouterPath(),
        component: BaselineDetailsComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_BASELINE,
          title: 'Quick MAPS - Baseline',
          keywords: 'Micronutrients, maps, policy, project objectives',
          description: 'Baseline estimates of dietary MN supplies and deficiency risks in the selected country or region.',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_PROJECTION.segments,
        component: ProjectionComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_PROJECTION,
          title: 'Quick MAPS - Projections to 2050',
          keywords: 'projections, scenarios, micronutrients, food systems, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050',
          description: 'Projections of food system changes under various scenarios.',
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_BIOMARKER.segments,
        component: BiomarkerComponent,
        data: {
          appRoute: AppRoutes.QUICK_MAPS_BIOMARKER,
          title: 'Quick Maps - Biomarker',
          keywords: '',
          description: '',
          hideQuickMapsHeader: true,
          showLightFooter: true,
        } as RouteData,
        canActivate: [QuickMapsRouteGuardService],
      }
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
export class QuickMapsRoutingModule { }
