import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { DirectivesModule } from '../directives/directives.module';
import { RoutesModule } from '../routes/routes.module';
import { HomeComponent } from './home/home.component';
import { QuickMapsModule } from './quickMaps/quickMaps.module';
import { StyleGuideComponent } from './styleGuide/styleGuide.component';
import { CostEffectivenessModule } from './costEffectiveness/costEffectiveness.module';
import { UserProfileComponent } from './userProfile/userProfile.component';

@NgModule({
  declarations: [HomeComponent, StyleGuideComponent, UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    CostEffectivenessModule,
    QuickMapsModule,
    RoutesModule,
    DirectivesModule,
  ],
  providers: [],
  exports: [],
})
export class PagesModule {}
