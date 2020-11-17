import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule],
    providers: [],
    exports: [HomeComponent],
})
export class PagesModule {}
