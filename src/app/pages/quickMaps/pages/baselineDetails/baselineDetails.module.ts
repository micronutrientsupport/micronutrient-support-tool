import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { GridsterModule } from 'angular-gridster2';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { BaselineDetailsComponent } from './baselineDetails.component';
import { MapViewComponent } from './map-view/map-view.component';
import { FoodCompositionViewComponent } from './food-composition-view/food-composition-view.component';
import { SummarisedDataTableComponent } from './summarisedDataTable/summarisedDataTable.component';
import { FoodItemsComponent } from './foodItems/foodItems.component';
import { HouseholdCardComponent } from './householdCard/householdCard.component';
import { MonthlyCardComponent } from './monthlyCard/monthlyCard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BaselineDescriptionComponent } from './baselineDescription/baselineDescription.component';
import { BaslineEstimateComponent } from './baselineEstimate/baselineEstimate.component';
@NgModule({
  declarations: [
    BaselineDetailsComponent,
    MapViewComponent,
    FoodCompositionViewComponent,
    SummarisedDataTableComponent,
    FoodItemsComponent,
    HouseholdCardComponent,
    MonthlyCardComponent,
    BaselineDescriptionComponent,
    BaslineEstimateComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
  ],
})
export class BaselineDetailsModule {}
