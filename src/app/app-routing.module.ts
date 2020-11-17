import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app-routes';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { QuickMapsComponent } from './pages/quickMaps/quickMaps.component';

const routes: Routes = [
  {
    path: AppRoutes.HOME.key,
    component: HomeComponent,
  },
  {
    path: AppRoutes.MAPS_TOOL.key,
    component: MapsToolComponent,
  },
  {
    path: AppRoutes.QUICK_MAPS.key,
    component: QuickMapsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
