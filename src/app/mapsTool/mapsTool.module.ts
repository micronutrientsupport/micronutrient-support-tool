import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapsToolComponent } from './mapsTool.component';
import { QuickMapsComponent } from './pages/quickMaps/quickMaps.component';

@NgModule({
    declarations: [MapsToolComponent, QuickMapsComponent],
    imports: [CommonModule, RouterModule],
    providers: [],
    exports: [MapsToolComponent, QuickMapsComponent],
})
export class MapsToolModule {}
