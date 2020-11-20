import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { ProjectionComponent } from './pages/projection/projection.component';
const routes: Routes = [
  {
    path: '',
    component: LocationSelectComponent,
  }, {
    path: AppRoutes.QUICK_MAPS_BASELINE.segments,
    component: BaselineDetailsComponent,
  }, {
    path: AppRoutes.QUICK_MAPS_PROJECTION.segments,
    component: ProjectionComponent,
  }, {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickMapsRoutingModule { }
