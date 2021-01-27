import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
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
          hideQuickMapsHeader: true,
          showLightFooter: true,
          showQuickMapsGoButton: true,
          title: 'Quick Maps',
          keywords: 'Micronutrients, maps, policy, quick maps, form, selection',
          description: 'Quick Maps form for selecting and filtering search criteria'
        },
      },
      {
        path: AppRoutes.QUICK_MAPS_BASELINE.segments.valueOf(),
        component: BaselineDetailsComponent,
        data: {
          title: 'Quick Maps - Baseline',
          keywords: 'Micronutrients, maps, policy, project objectives',
          description: 'Baseline estimates of dietary MN supplies and deficiency risks in the selected country or region.',
          showLightFooter: true,
        },
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_PROJECTION.segments.valueOf(),
        component: ProjectionComponent,
        data: {
          title: 'Quick Maps - Projections to 2050',
          keywords: 'projections, scenarios, micronutrients, food systems, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045, 2050',
          description: 'Projections of food system changes under various scenarios.',
          showLightFooter: true,
        },

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
export class QuickMapsRoutingModule { }
