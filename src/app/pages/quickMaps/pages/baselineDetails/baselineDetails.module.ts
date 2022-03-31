import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { GridsterModule } from 'angular-gridster2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { BaselineDetailsComponent } from './baselineDetails.component';
import { MapViewComponent } from './mapView/mapView.component';
import { FoodItemsComponent } from './foodItems/foodItems.component';
import { HouseholdSupplyComponent } from './householdSupply/householdSupply.component';
import { MonthlyFoodComponent } from './monthlyFood/monthlyFood.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { BaselineDescriptionComponent } from './baselineDescription/baselineDescription.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { QuickMapsComponentsModule } from '../../components/quickMapsComponents.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
@NgModule({
  declarations: [
    BaselineDetailsComponent,
    MapViewComponent,
    FoodItemsComponent,
    HouseholdSupplyComponent,
    MonthlyFoodComponent,
    BaselineDescriptionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    RouterModule,
    QuickMapsComponentsModule,
    DirectivesModule,
  ],
})
export class BaselineDetailsModule {}
