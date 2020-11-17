import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { MapsToolModule } from './mapsTool/mapsTool.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        PagesModule,
        ComponentsModule,
        MapsToolModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
