import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MapsToolComponent } from './mapsTool.component';

@NgModule({
  declarations: [
    MapsToolComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    MapsToolComponent,
  ]
})
export class MapsToolModule { }
