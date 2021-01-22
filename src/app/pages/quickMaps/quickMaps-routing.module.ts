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
        data: { hideQuickMapsHeader: true },
      },
      {
        path: AppRoutes.QUICK_MAPS_BASELINE.segments.valueOf(),
        component: BaselineDetailsComponent,
        data: { title: 'Micronutrient Action Policy Support (MAPS): Quick Maps - Baseline' },
        canActivate: [QuickMapsRouteGuardService],
      },
      {
        path: AppRoutes.QUICK_MAPS_PROJECTION.segments.valueOf(),
        component: ProjectionComponent,
        data: { title: 'Micronutrient Action Policy Support (MAPS): Quick Maps - Projections to 2050' },
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
