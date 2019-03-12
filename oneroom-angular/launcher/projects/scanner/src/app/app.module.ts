import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectorComponent } from './detector/detector.component';

const arrProviders = [];

@NgModule({
  declarations: [DetectorComponent]
})
export class ScannerAppSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: arrProviders
    };
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: arrProviders,
  bootstrap: [AppComponent]
})
export class AppModule { }


