import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsRoutingModule } from './quickMaps-routing.module';
import { SideNavContentComponent } from './components/sideNavContent/sideNavContent.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { ReactiveFormsModule } from '@angular/forms';
import { QuickMapsService } from './quickMaps.service';
import { BaselineDetailsComponent } from './pages/baselineDetails/baselineDetails.component';
import { ProjectionComponent } from './pages/projection/projection.component';
import { LocationSelectComponent } from './pages/locationSelect/locationSelect.component';
import { QuickMapsHeaderComponent } from './components/quickMapsHeader.component/quickMapsHeader.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { MapViewComponent } from './pages/baselineDetails/map-view/map-view.component';
import { FoodCompositionViewComponent } from './pages/baselineDetails/food-composition-view/food-composition-view.component';
import { SummarisedDataTableComponent } from './pages/baselineDetails/summarisedDataTable/summarisedDataTable.component';
import { FoodItemsComponent } from './pages/baselineDetails/foodItems/foodItems.component';
import { ChartCardComponent } from './pages/baselineDetails/chartCard/chartCard.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { QuickMapsComponent } from './quickMaps.component';
import { CardComponent } from './pages/components/card/card.component';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    QuickMapsComponent,
    LocationSelectComponent,
    SideNavContentComponent,
    ProjectionComponent,
    BaselineDetailsComponent,
    QuickMapsHeaderComponent,
    MapViewComponent,
    FoodCompositionViewComponent,
    SummarisedDataTableComponent,
    FoodItemsComponent,
    ChartCardComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    QuickMapsRoutingModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    PlotlyModule,
  ],
  providers: [QuickMapsService],
})
export class QuickMapsModule {}
