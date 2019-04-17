import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { AnalogComponent } from './analog/analog.component';
import { DigitalComponent } from './digital/digital.component';

const arrProviders = [];

@NgModule({
  declarations: [
    ClockComponent,
    AnalogComponent,
    DigitalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: arrProviders,
  bootstrap: [AppComponent]
})
export class ClockAppSharedModule {
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
