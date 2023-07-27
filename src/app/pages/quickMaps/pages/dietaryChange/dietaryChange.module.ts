import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material.module';
import { RoutesModule } from 'src/app/routes/routes.module';
import { DietaryChangeComponent } from './dietaryChange.component';
import { DietaryChangeComponentsModule } from './components/dietaryChangeComponents.module';
import { GridsterModule } from 'angular-gridster2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { DietaryChangeService } from './dietaryChange.service';
import { FormsModule } from '@angular/forms';
import { UtilitiesModule } from 'src/utility/utilities.module';

@NgModule({
  declarations: [DietaryChangeComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RoutesModule,
    DietaryChangeComponentsModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    FormsModule,
    UtilitiesModule,
  ],
  providers: [DietaryChangeService],
  exports: [DietaryChangeComponent],
})
export class DietaryChangeModule {}
