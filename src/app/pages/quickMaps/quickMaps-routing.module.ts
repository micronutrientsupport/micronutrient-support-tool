import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { BaselineComponent } from './pages/baseline/baseline.component';
import { MapPageComponent } from './pages/components/mapPage/mapPage.component';
const routes: Routes = [
  {
    path: '',
    component: MapPageComponent,
  },
  {
    path: AppRoutes.QUICK_MAPS_BASELINE.segments,
    component: BaselineComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickMapsRoutingModule { }
