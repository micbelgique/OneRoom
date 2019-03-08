import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScannerAppSharedModule } from 'projects/scanner/src/app/app.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
  MatSelectModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SettingsComponent } from './settings/settings.component';
import { ModalChangeNameComponent } from './modal-change-name/modal-change-name.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LockscreenComponent,
    SettingsComponent,
    ModalChangeNameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScannerAppSharedModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HttpClientModule,
    MatSelectModule
  ],
  entryComponents: [
    ModalChangeNameComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
