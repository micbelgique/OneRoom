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
  MatDialogModule,
  MatTableModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTooltipModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
// us locale is default
// FR locale
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { TeamsComponent } from './teams/teams.component';
import { SettingsComponent } from './settings/settings.component';
import { GamesComponent } from './games/games.component';
import { UsersComponent } from './users/users.component';
import { ParticipantComponent } from './participant/participant.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { NotifierModule } from 'angular-notifier';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    SettingsComponent,
    GamesComponent,
    UsersComponent,
    ChallengeComponent,
    ScenarioComponent,
    ParticipantComponent
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
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    RouterModule.forRoot([
      { path: 'settings', component: SettingsComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'games', component: GamesComponent },
      { path: 'challenges', component: ChallengeComponent },
      { path: 'scenario', component: ScenarioComponent },
      { path: 'users', component: UsersComponent },
      { path: 'participants', component: ParticipantComponent },
      { path: '**', redirectTo: 'settings', pathMatch: 'full' }
    ]),
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatTableModule,
    NotifierModule.withConfig( {
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
