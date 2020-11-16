import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app-routes';
import { MapsToolComponent } from './mapsTool/mapsTool.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: AppRoutes.HOME.key,
    component: HomeComponent,
  }, {
    path: AppRoutes.MAPS_TOOL.key,
    component: MapsToolComponent, // maybe lazy loaded with it's own router?? not sure how route constants will work then.
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
