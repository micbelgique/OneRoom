import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatTabsModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatOptionModule,
  MatSliderModule,
  MatChipsModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';


const arrProviders = [];

@NgModule({
  declarations: [
  ChatComponent],
  imports : [
    MatSliderModule,
    MatOptionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    BrowserModule,
    MatChipsModule
  ],
  exports : [ChatComponent]
})
export class ChatbotAppSharedModule {
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

