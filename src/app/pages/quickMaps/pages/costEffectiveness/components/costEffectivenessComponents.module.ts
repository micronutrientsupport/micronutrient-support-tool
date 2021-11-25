import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [DescriptionComponent, MenuComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [DescriptionComponent, MenuComponent],
})
export class CostEffectivenessComponentsModule {}
