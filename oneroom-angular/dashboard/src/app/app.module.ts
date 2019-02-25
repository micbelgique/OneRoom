import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
  MatDialogModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
// us locale is default
// FR locale
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { TeamsComponent } from './teams/teams.component';
import { SettingsComponent } from './settings/settings.component';
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule.forRoot([
      { path: 'settings', component: SettingsComponent },
      { path: 'team', component: TeamsComponent },
      { path: '**', redirectTo: 'team', pathMatch: 'full' }
    ]),
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
